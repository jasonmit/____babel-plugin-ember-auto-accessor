'use strict';

module.exports = function({ Plugin, types }) {
  function flatten(node) {
    // walk memberExpression building up the keys
  }

  return new Plugin('babel-plugin-ember-auto-accessor', {
    visitor: {
      AssignmentExpression(node) {
        console.log(node)

        return node;
      },
      CallExpression(node) {
        return node;
      }
    }
  });
}
