/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');


Thing.find({}).remove(function () {
  Thing.create(
    //{
    //  name: 'localhost',
    //  info: 'Locally installed environment',
    //  active: true,
    //  featured: true,
    //},
    //{
    //  name: 'virtualbox://default',
    //  info: 'Default docker-machine environment.',
    //  active: true,
    //},
    //{
    //  name: 'virtualbox://test',
    //  info: 'Test docker-machine environment.',
    //  active: false,
    //},
    //{
    //  name: 'virtualbox://staging',
    //  info: 'Staging docker-machine environment.',
    //  active: false,
    //},
    //{
    //  name: 'virtualbox://live',
    //  info: 'Live docker-machine environment.',
    //  active: false,
    //}
  );
});
