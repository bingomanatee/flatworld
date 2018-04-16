import _ from 'lodash';

export default (bottle) => {
  bottle.factory('StateConfig', (container) => class StateConfig {
    constructor (initialState = {}) {
      this._initialStateMap = new Map();
      for (let key in initialState) {
        this._initialStateMap.set(key, initialState[key]);
      }
      this._effectsMap = new Map();
    }

    get initialState () {
      return () => {
        let hash = {};
        this._initialStateMap.forEach((value, key) => hash[key] = value);
        return hash;
      }
    }

    get effects () {
      let hash = {};
      this._effectsMap.forEach((value, key) => hash[key] = value);
      return hash;
    }

    addEffect (key, value) {
      this._effectsMap.set(key, value);
    }

    addInitialState (key, value) {
      this._initialStateMap.set(key, value);
    }

    addSetEffect (name) {
      let effectName = 'set' + _.capitalize(name);

      this.addEffect(effectName, container.update((state, value) => {
        let hash = {};
        hash[name] = value;
        return hash;
      }));
    }

    addStateAndSetEffect (name, value) {
      this.addInitialState(name, value);
      this.addSetEffect(name);
    }

    toHash () {
      return {
        effects: this.effects,
        initialState: this.initialState
      }
    }
  })


}