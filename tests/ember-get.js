'use strict';

const { transform } = require('babel');
const { equal } = require('assert');

const plugin = require('../');

function code(program) {
  const transformed = transform(program, {
    blacklist: ['useStrict'],
    plugins: [plugin],
    compact: true
  });

  return transformed.code;
}

describe.skip('Ember.get transforms', function() {
  it('converts thisExpression', () => {
    equal(code('this.firstName;'), `Ember.get(this,"firstName");`);
  });

  it('converts deep thisExpression', () => {
    equal(code('this.person.firstName;'), `Ember.get(this,"person.firstName");`);
  });

  it('converts expression', () => {
    equal(code('window.firstName;'), `Ember.get(window,"firstName");`);
  });

  it('converts deeply nested', () => {
    equal(code('window.person.firstName;'), `Ember.get(window,"person.firstName");`);
  });

  it('skips on callExpression', () => {
    equal(code('window.foo().bar;'), `window.foo().bar;`);
  });

  it.skip('handles computed path', () => {
    equal(code('window[dynamicPath];'), `Ember.set(window,dynamicPath);`);
  });

  it.skip('handles complex computed paths', () => {
    equal(code('window[dynamicPath].foo;'), `Ember.set(window,dynamicPath+'.foo');`);
  });
});
