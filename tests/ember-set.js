'use strict';

const babel = require('babel');
const assert = require('assert');

const plugin = require('../');

function code(program) {
  return babel.transform(program, {
    blacklist: ['useStrict'],
    plugins: [plugin],
    compact: true
  }).code;
}

describe('Ember.set transforms', function() {
  it('skips AssignmentExpression where left is a VariableDeclarator (var)', () => {
    assert.equal(code('var foo = true;'), `var foo = true;`);
  });
  
  it('skips AssignmentExpression where left is a VariableDeclarator (let)', () => {
    assert.equal(code('let foo = true;'), `let foo = true;`);
  });
  
  it('skips AssignmentExpression where left is a VariableDeclarator (const)', () => {
    assert.equal(code('const foo = true;'), `const foo = true;`);
  });

  it('skips AssignmentExpression where left is a VariableDeclarator (no declaration)', () => {
    assert.equal(code('foo = true;'), `foo = true;`);
  });
 
  it('converts assignmentExpression', () => {
    assert.equal(code('window.foo = true;'), `Ember.set(window, 'foo', true);`);
  });

  it('converts thisExpression', () => {
    assert.equal(code('this.foo = true;'), `Ember.set(this, 'foo', true);`);
  });
  
  it('converts thisExpression', () => {
    assert.equal(code('const SYM = Symbol(); this[SYM] = true;'), `Ember.set(this, ???, true);`);
  });

  it('converts memberExpressionLiterals', () => {
    assert.equal(code('window.foo["bar"] = true;'), `Ember.set(window, 'foo.bar', true);`);
  });
  
  it('it throws on literals with periods', () => {
    let triggered = false;

    try {
      code('window.foo["bar.baz"] = true;');
    } catch(e) {
      assert.equal(e.message, 'Member Expression Literals cannot contain periods.');
      triggered = true;
    }
    
    assert.ok(triggered);
  });
});
