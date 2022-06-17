<?php

namespace Drupal\drupalmoduleupgrader;

/**
 * Defines a report generated by the dmu-analyze command. Issues returned by
 * analyzers are added to this report, then it's handed off to the theme system.
 */
interface ReportInterface {

  /**
   * Adds an issue to this module.
   *
   * @param IssueInterface $issue
   *   The issue to add.
   *
   * @return $this
   */
  public function addIssue(IssueInterface $issue);

  /**
   * Returns all issues collected so far, optionally filtered by a tag.
   *
   * @param string|null $tag
   *   (optional) A tag name. If set, only issues which have this tag will
   *   be returned (regardless of the tag's value in each issue -- it's up to
   *   the calling code to do any further filtering).
   *
   * @return IssueInterface[]
   */
  public function getIssues($tag = NULL);

}
