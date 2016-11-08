'use strict';

const debug = require('debug');

const call = debug('call');
const assignment = debug('assignment');

module.exports = function({ Plugin, types }) {
  function flatten(node) {
    // walk memberExpression building up the keys
  }

  return new Plugin('babel-plugin-ember-auto-accessor', {
    visitor: {
      AssignmentExpression(node) {
        console.log(node)

        return node;
      }
    }
  });
}
