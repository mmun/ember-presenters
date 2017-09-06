import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('present', 'helper:present', {
  integration: true
});

test('it throws an error if the name is not a string', function(assert) {
  assert.expectAssertion(() => {
    this.render(hbs`{{present 123}}`);
  }, /A presenter must be a string but you passed number/);
});

test('it throws an error if the presenter is not found', function(assert) {
  assert.expectAssertion(() => {
    this.render(hbs`{{present 'post'}}`);
  }, /A presenter with name 'post' was not found/);
});

test('lifecycle is correct', function(assert) {
  let events;

  this.register('presenter:foo', Ember.Object.extend({
    init() {
      this._super(...arguments);
      events.push('initFoo');
    },

    willDestroy() {
      events.push('destroyFoo');
    }
  }));

  this.register('presenter:bar', Ember.Object.extend({
    init() {
      this._super(...arguments);
      events.push('initBar');
    },

    willDestroy() {
      events.push('destroyBar');
    }
  }));


  events = [];
  this.set('name', 'foo');
  this.set('show', true);
  this.set('value', 1);

  this.render(hbs`{{#if show}}{{get (present name key=value) 'key'}}{{/if}}`);

  assert.deepEqual(events, ['initFoo']);

  events = [];
  this.set('name', 'bar');

  assert.equal(this.$().text().trim(), '1');
  assert.deepEqual(events, ['initBar', 'destroyFoo']); // In Ember, destruction is deferred.

  events = [];
  this.set('value', 2);

  assert.equal(this.$().text().trim(), '2');
  assert.deepEqual(events, []);

  this.set('show', false);

  assert.deepEqual(events, ['destroyBar']);
});
