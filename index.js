'use strict';

const ALLOWED_TYPES = ['ThisExpression', 'MemberExpression', 'Identifier'];

module.exports = function({ Plugin, types:t }) {
  const seen = new Set();

  function setterTransform(target, key, value) {
    const mexpr = t.memberExpression(
      t.identifier('Ember'),
      t.identifier('set')
    );

    seen.add(mexpr);

    return t.callExpression(mexpr, [
      t.identifier(target),
      t.literal(key),
      value
    ]);
  }

  function getterTransform(target, key) {
    const mexpr = t.memberExpression(
      t.identifier('Ember'),
      t.identifier('get')
    );

    seen.add(mexpr);

    return t.callExpression(mexpr, [
      target,
      t.literal(key)
    ]);
  }

  return new Plugin('babel-plugin-ember-auto-accessor', {
    visitor: {
      AssignmentExpression(node, parent, scope, file) {
        if (seen.has(node)) {
       		return;
        }

        const { left, right } = node;

        return setterTransform(left.object.name, left.property.name, right);
      },

      MemberExpression(node, parent, scope, file) {
        if (t.isAssignmentExpression(parent) || seen.has(node) || (parent && seen.has(parent))) {
          return;
        }

        let paths = [];
        let current = node;
        let nodeSupported = true;
        let target = null;

        while (current) {
          if (nodeSupported && !ALLOWED_TYPES.includes(current.type)) {
            nodeSupported = false;
            continue;
          }

          if (t.isMemberExpression(current)) {
            if (current.computed) {
              throw new Error('computeds within a MemberExpression is not yet supported');
            }

            target = current.object;
            paths.push(current.property.name);
          }

          seen.add(current);
          current = current.object;
        }

        if (!nodeSupported) {
          /**
           * Now that we marked all the nodes as seen
           * we can return the original node since it contained
           * a node type that is not supported
           */
          return node;
        }

        return getterTransform(target, paths.reverse().join('.'));
      }
    }
  });
}
