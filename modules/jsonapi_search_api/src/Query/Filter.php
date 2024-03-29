<?php

namespace Drupal\jsonapi_search_api\Query;

use Drupal\search_api\Query\QueryInterface;
use Drupal\jsonapi\Query\EntityConditionGroup;

/**
 * Gathers information about the filter parameter.
 *
 * Copied from \Drupal\jsonapi\Query\Filter class to support using Search API
 * queries.
 *
 * @see \Drupal\jsonapi\Query\Filter
 */
class Filter {

  /**
   * The JSON:API filter key name.
   *
   * @var string
   */
  const KEY_NAME = 'filter';

  /**
   * The key for the implicit root group.
   */
  const ROOT_ID = '@root';

  /**
   * Key in the filter[<key>] parameter for conditions.
   *
   * @var string
   */
  const CONDITION_KEY = 'condition';

  /**
   * Key in the filter[<key>] parameter for groups.
   *
   * @var string
   */
  const GROUP_KEY = 'group';

  /**
   * Key in the filter[<id>][<key>] parameter for group membership.
   *
   * @var string
   */
  const MEMBER_KEY = 'memberOf';

  /**
   * The root condition group.
   *
   * @var string
   */
  protected $root;

  /**
   * Constructs a new Filter object.
   *
   * @param \Drupal\jsonapi\Query\EntityConditionGroup $root
   *   An entity condition group which can be applied to an entity query.
   */
  public function __construct(EntityConditionGroup $root) {
    $this->root = $root;
  }

  /**
   * Gets the root condition group.
   */
  public function root() {
    return $this->root;
  }

  /**
   * Applies the root condition to the given query.
   *
   * @param \Drupal\search_api\Query\QueryInterface $query
   *   The query for which the condition should be constructed.
   *
   * @return \Drupal\search_api\Query\ConditionGroupInterface
   *   The compiled entity query condition.
   */
  public function queryCondition(QueryInterface $query) {
    $condition = $this->buildGroup($query, $this->root());
    return $condition;
  }

  /**
   * Applies the root condition to the given query.
   *
   * @param \Drupal\search_api\Query\QueryInterface $query
   *   The query to which the filter should be applied.
   * @param \Drupal\jsonapi\Query\EntityConditionGroup $condition_group
   *   The condition group to build.
   *
   * @return \Drupal\search_api\Query\ConditionGroupInterface
   *   The query with the filter applied.
   */
  protected function buildGroup(QueryInterface $query, EntityConditionGroup $condition_group) {
    // Create a condition group using the original query.
    switch ($condition_group->conjunction()) {
      case 'AND':
        $group = $query->createConditionGroup();
        break;

      case 'OR':
        $group = $query->createConditionGroup('OR');
        break;
    }

    // Get all children of the group.
    $members = $condition_group->members();

    foreach ($members as $member) {
      // If the child is simply a condition, add it to the new group.
      if ($member instanceof EntityCondition) {
        if ($member->operator() == 'IS NULL') {
          $group->addCondition($member->field(), NULL, '=');
        }
        elseif ($member->operator() == 'IS NOT NULL') {
          $group->addCondition($member->field(), NULL, '<>');
        }
        else {
          $group->addCondition($member->field(), $member->value(), $member->operator());
        }
      }
      // If the child is a group, then recursively construct a sub group.
      elseif ($member instanceof EntityConditionGroup) {
        // Add the subgroup to this new group.
        $subgroup = $this->buildGroup($query, $member);
        $group->addConditionGroup($subgroup);
      }
    }

    // Return the constructed group so that it can be added to the query.
    return $group;
  }

  /**
   * Creates a Sort object from a query parameter.
   *
   * @param mixed $parameter
   *   The `filter` query parameter from the Symfony request object.
   *
   * @return self
   *   A Sort object with defaults.
   */
  public static function createFromQueryParameter($parameter) {
    $expanded = static::expand($parameter);
    return new static(static::buildEntityConditionGroup($expanded));
  }

  /**
   * Expands any filter parameters using shorthand notation.
   *
   * @param array $original
   *   The unexpanded filter data.
   *
   * @return array
   *   The expanded filter data.
   */
  protected static function expand(array $original) {
    $expanded = [];
    foreach ($original as $key => $item) {
      // Allow extreme shorthand filters, f.e. `?filter[promote]=1`.
      if (!is_array($item)) {
        $item = [
          EntityCondition::VALUE_KEY => $item,
        ];
      }

      // Throw an exception if the query uses the reserved filter id for the
      // root group.
      if ($key == static::ROOT_ID) {
        $msg = sprintf("'%s' is a reserved filter id.", static::ROOT_ID);
        throw new \UnexpectedValueException($msg);
      }

      // Add a memberOf key to all items.
      if (isset($item[static::CONDITION_KEY][static::MEMBER_KEY])) {
        $item[static::MEMBER_KEY] = $item[static::CONDITION_KEY][static::MEMBER_KEY];
        unset($item[static::CONDITION_KEY][static::MEMBER_KEY]);
      }
      elseif (isset($item[static::GROUP_KEY][static::MEMBER_KEY])) {
        $item[static::MEMBER_KEY] = $item[static::GROUP_KEY][static::MEMBER_KEY];
        unset($item[static::GROUP_KEY][static::MEMBER_KEY]);
      }
      else {
        $item[static::MEMBER_KEY] = static::ROOT_ID;
      }

      // Add the filter id to all items.
      $item['id'] = $key;

      // Expands shorthand filters.
      $expanded[$key] = static::expandItem($key, $item);
    }

    return $expanded;
  }

  /**
   * Expands a filter item in case a shortcut was used.
   *
   * Possible cases for the conditions:
   *   1. filter[uuid][value]=1234.
   *   2. filter[0][condition][field]=uuid&filter[0][condition][value]=1234.
   *   3. filter[uuid][condition][value]=1234.
   *   4. filter[uuid][value]=1234&filter[uuid][group]=my_group.
   *
   * @param string $filter_index
   *   The index.
   * @param array $filter_item
   *   The raw filter item.
   *
   * @return array
   *   The expanded filter item.
   */
  protected static function expandItem($filter_index, array $filter_item) {
    if (isset($filter_item[EntityCondition::VALUE_KEY])) {
      if (!isset($filter_item[EntityCondition::PATH_KEY])) {
        $filter_item[EntityCondition::PATH_KEY] = $filter_index;
      }

      $filter_item = [
        static::CONDITION_KEY => $filter_item,
        static::MEMBER_KEY => $filter_item[static::MEMBER_KEY],
      ];
    }

    if (!isset($filter_item[static::CONDITION_KEY][EntityCondition::OPERATOR_KEY])) {
      $filter_item[static::CONDITION_KEY][EntityCondition::OPERATOR_KEY] = '=';
    }

    return $filter_item;
  }

  /**
   * Denormalizes the given filter items into a single EntityConditionGroup.
   *
   * @param array $items
   *   The normalized entity conditions and groups.
   *
   * @return \Drupal\jsonapi\Query\EntityConditionGroup
   *   A root group containing all the denormalized conditions and groups.
   */
  protected static function buildEntityConditionGroup(array $items) {
    $root = [
      'id' => static::ROOT_ID,
      static::GROUP_KEY => ['conjunction' => 'AND'],
    ];
    return static::buildTree($root, $items);
  }

  /**
   * Organizes the flat, normalized filter items into a tree structure.
   *
   * @param array $root
   *   The root of the tree to build.
   * @param array $items
   *   The normalized entity conditions and groups.
   *
   * @return \Drupal\jsonapi\Query\EntityConditionGroup
   *   The entity condition group
   */
  protected static function buildTree(array $root, array $items) {
    $id = $root['id'];

    // Recursively build a tree of denormalized conditions and condition groups.
    $members = [];
    foreach ($items as $item) {
      if ($item[static::MEMBER_KEY] == $id) {
        if (isset($item[static::GROUP_KEY])) {
          array_push($members, static::buildTree($item, $items));
        }
        elseif (isset($item[static::CONDITION_KEY])) {
          $condition = EntityCondition::createFromQueryParameter($item[static::CONDITION_KEY]);
          array_push($members, $condition);
        }
      }
    }

    $root[static::GROUP_KEY]['members'] = $members;

    // Denormalize the root into a condition group.
    return new EntityConditionGroup($root[static::GROUP_KEY]['conjunction'], $root[static::GROUP_KEY]['members']);
  }

}
