'use strict';

const babel = require('babel');
const assert = require('assert');

const plugin = require('../');

function code(program) {
  return babel.transform(program, {
    plugins: [plugin]
  }).code;
}

describe('Ember.set transforms', function() {
  it('converts assignmentExpression', () => {
    assert.equal(code('window.foo = true;'), `Ember.set(window, 'foo', true);`);
  });

  it('converts thisExpression', () => {
    assert.equal(code('this.foo = true;'), `Ember.set(this, 'foo', true);`);
  });

  it('converts memberExpressionLiterals', () => {
    assert.equal(code('window.foo["bar"] = true;'), `Ember.set(window, 'foo.bar', true);`);
  });
});
