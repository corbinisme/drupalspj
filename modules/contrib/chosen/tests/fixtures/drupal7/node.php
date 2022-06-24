<?php
// phpcs:ignoreFile
/**
 * @file
 * A database agnostic dump for testing purposes.
 *
 * This file was generated by the Drupal 9.2.6 db-tools.php script.
 */

use Drupal\Core\Database\Database;

$connection = Database::getConnection();

$connection->schema()->createTable('node', array(
  'fields' => array(
    'nid' => array(
      'type' => 'serial',
      'not null' => TRUE,
      'size' => 'normal',
      'unsigned' => TRUE,
    ),
    'vid' => array(
      'type' => 'int',
      'not null' => FALSE,
      'size' => 'normal',
      'unsigned' => TRUE,
    ),
    'type' => array(
      'type' => 'varchar',
      'not null' => TRUE,
      'length' => '32',
      'default' => '',
    ),
    'language' => array(
      'type' => 'varchar',
      'not null' => TRUE,
      'length' => '12',
      'default' => '',
    ),
    'title' => array(
      'type' => 'varchar',
      'not null' => TRUE,
      'length' => '255',
      'default' => '',
    ),
    'uid' => array(
      'type' => 'int',
      'not null' => TRUE,
      'size' => 'normal',
      'default' => '0',
    ),
    'status' => array(
      'type' => 'int',
      'not null' => TRUE,
      'size' => 'normal',
      'default' => '1',
    ),
    'created' => array(
      'type' => 'int',
      'not null' => TRUE,
      'size' => 'normal',
      'default' => '0',
    ),
    'changed' => array(
      'type' => 'int',
      'not null' => TRUE,
      'size' => 'normal',
      'default' => '0',
    ),
    'comment' => array(
      'type' => 'int',
      'not null' => TRUE,
      'size' => 'normal',
      'default' => '0',
    ),
    'promote' => array(
      'type' => 'int',
      'not null' => TRUE,
      'size' => 'normal',
      'default' => '0',
    ),
    'sticky' => array(
      'type' => 'int',
      'not null' => TRUE,
      'size' => 'normal',
      'default' => '0',
    ),
    'tnid' => array(
      'type' => 'int',
      'not null' => TRUE,
      'size' => 'normal',
      'default' => '0',
      'unsigned' => TRUE,
    ),
    'translate' => array(
      'type' => 'int',
      'not null' => TRUE,
      'size' => 'normal',
      'default' => '0',
    ),
  ),
  'primary key' => array(
    'nid',
  ),
  'unique keys' => array(
    'vid' => array(
      'vid',
    ),
  ),
  'indexes' => array(
    'node_changed' => array(
      'changed',
    ),
    'node_created' => array(
      'created',
    ),
    'node_frontpage' => array(
      'promote',
      'status',
      'sticky',
      'created',
    ),
    'node_status_type' => array(
      'status',
      'type',
      'nid',
    ),
    'node_title_type' => array(
      'title',
      array(
        'type',
        '4',
      ),
    ),
    'node_type' => array(
      array(
        'type',
        '4',
      ),
    ),
    'uid' => array(
      'uid',
    ),
    'tnid' => array(
      'tnid',
    ),
    'translate' => array(
      'translate',
    ),
    'language' => array(
      'language',
    ),
  ),
  'mysql_character_set' => 'utf8mb3',
));

$connection->insert('node')
->fields(array(
  'nid',
  'vid',
  'type',
  'language',
  'title',
  'uid',
  'status',
  'created',
  'changed',
  'comment',
  'promote',
  'sticky',
  'tnid',
  'translate',
))
->values(array(
  'nid' => '10',
  'vid' => '10',
  'type' => 'article',
  'language' => 'und',
  'title' => 'car 1 ',
  'uid' => '1',
  'status' => '1',
  'created' => '1649669486',
  'changed' => '1649758662',
  'comment' => '2',
  'promote' => '1',
  'sticky' => '0',
  'tnid' => '0',
  'translate' => '0',
))
->execute();