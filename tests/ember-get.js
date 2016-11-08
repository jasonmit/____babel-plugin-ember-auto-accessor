'use strict';

const babel = require('babel');
const assert = require('assert');

const plugin = require('../');

function code(program) {
  return babel.transform(program, {
    plugins: [plugin]
  }).code;
}

describe('Ember.get transforms', function() {
  it('converts thisExpression', () => {
    assert.equal(code('this.firstName;'), `Ember.get(this, 'firstName');`);
  });

  it('converts expression', () => {
    assert.equal(code('window.firstName;'), `Ember.get(window, 'firstName');`);
  });

  it('converts deeply nested', () => {
    assert.equal(code('window.person.firstName;'), `Ember.get(window, 'persona.firstName');`);
  });
});
