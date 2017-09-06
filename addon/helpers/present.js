import Ember from 'ember';
import { assert } from '@ember/debug';

export default Ember.Helper.extend({
  init() {
    this._super(...arguments);

    this.name = null;
    this.presenter = null;
  },

  createPresenter(name) {
    let owner = Ember.getOwner(this);
    let Presenter = owner.factoryFor(`presenter:${name}`);

    assert(
      `A presenter with name '${name}' was not found`,
      !!Presenter
    );

    return Presenter.create();
  },

  destroyPresenter() {
    if (this.presenter && this.presenter.destroy) {
      this.presenter.destroy();
    }
  },

  compute([name], props) {
    assert(
      `A presenter must be a string but you passed ${typeof name}`,
      typeof name === 'string'
    );

    if (this.name !== name) {
      this.name = name;
      this.destroyPresenter();
      this.presenter = this.createPresenter(name);
    }

    Ember.setProperties(this.presenter, props);

    return this.presenter;
  },

  willDestroy() {
    this.destroyPresenter();
  }
});
