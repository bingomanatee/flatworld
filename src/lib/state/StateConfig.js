import _ from 'lodash';

function storageAvailable (type) {
  try {
    var storage = window[type],
      x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch (e) {
    return e instanceof DOMException && (
        // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0;
  }
}

export default (bottle) => {
  bottle.factory('localStorage', (container) => {
    if (storageAvailable('localStorage')) {
      return localStorage;
    } else {
      return false;
    }
  });

  bottle.factory('localStorageHas', ({localStorage}) => {
    return (key) => {
      return localStorage ? localStorage.getItem(key) !== null : false;
    }
  });

  bottle.factory('StateConfig', (container) => class StateConfig {

    TYPE_STRING = 'STRING'
    TYPE_INT = 'INT'
    TYPE_FLOAT = 'FLOAT'
    TYPE_OBJECT = 'OBJECT'
    TYPE_BOOLEAN = 'BOOLEAN'

    SERIALIZATION_NONE = 'NONE'
    SERIALIZATION_LOCAL_STORAGE = 'LOCAL_STORAGE'

    constructor (initialState = {}, serializationSource = StateConfig.SERIALIZATION_NONE) {
      this.serializationSource = serializationSource;
      this._stateMap = new Map();
      this._middleware = [];
      for (let key in initialState) {
        this._stateMap.set(key, initialState[key]);
      }
      this._effectsMap = new Map();

      if (this.serializationSource === StateConfig.SERIALIZATION_LOCAL_STORAGE) {
        this.addLocalStorageMiddleware()
      }
    }

    static deserialize (value, type) {
      if (value === null || _.isUndefined(value)) {
        return null;
      }
      switch (type) {
        case StateConfig.TYPE_OBJECT:
          //@TODO: try/catch
          return JSON.parse(value);
          break;

        case StateConfig.TYPE_INT:
          value = parseInt(value);
          if (isNaN(value)) {
            value = 0;
          }
          break;

        case StateConfig.TYPE_BOOLEAN:
          value = !!parseInt(value);
          break;
      }
      return value;
    }

    static serialize (value, type) {
      if (value === null || _.isUndefined(value)) {
        return null;
      }
      switch (type) {
        case StateConfig.TYPE_OBJECT:
          return JSON.stringify(value);
          break;

        case StateConfig.TYPE_INT:
          if (isNaN(value)) {
            return 0;
          }
          return value.toString();
          break;

        case StateConfig.TYPE_BOOLEAN:
          return value ? '1' : '0';
          break;

        default:
          return value;
      }
    }

    addArrayAndSetEffect(name, value = []) {
      //@TODO: add type enforcement for values
      this.addStateValue(name,value ? value.slice(0) : [], StateConfig.TYPE_OBJECT);
      this.addEffect(`set${_.upperFirst(name)}`, (element, array) => (state) => {
        let hash = {};
        hash[name] = array.slice(0);
        return Object.assign({}, state, hash);
      });
      this.addEffect(`set${_.upperFirst(name)}Element`, (event, key, value) => (state) => {
        let newArray = state[name] || [];
        newArray[key] = value;
        let hash = {};
        hash[name] = newArray;
        return Object.assign({}, state, hash);
      });
    }

    addLocalStorageMiddleware () {
      if (container.localStorage) {
        this.addMiddleware((freactalCtx) => {
          this._stateMap.forEach((data, key) => {
            // note: no way of checking inclusion of key in state ??
            let value = freactalCtx.state[key];
            //@TODO: type keyed saving
            container.localStorage.setItem(key, StateConfig.serialize(value, data.type));
          });
          return freactalCtx;
        })
      } else {
        console.log('no local storage');
      }
    }

    get initialState () {
      return () => {
        let hash = {};
        this._stateMap.forEach((data, key) => {
          hash[key] = data.value;
          if (container.localStorageHas(key)) {
            hash[key] = StateConfig.deserialize(container.localStorage.getItem(key),
              data.type);
          }
        });
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

    addMiddleware (method) {
      this._middleware.push(method);
    }

    addStateValue (key, value, type = StateConfig.TYPE_STRING) {
      this._stateMap.set(key, {value, type});
    }

    addSetEffect (name, type = StateConfig.TYPE_STRING) {
      let effectName = 'set' + _.upperFirst(name);
      // @TODO: validation
      this.addEffect(effectName, container.update((state, value) => {
        let hash = {};
        hash[name] = value;
        return hash;
      }));
    }

    addBoolEffect (name) {
      this.addSetEffect(name, StateConfig.TYPE_BOOLEAN);
      this.addEffect(`${name}On`, container.update((state) => {
        let hash = {};
        hash[name] = true;
        return hash;
      }))
      this.addEffect(`${name}Off`, container.update((state) => {
        let hash = {};
        hash[name] = false;
        return hash;
      }))
    }

    addStateAndSetEffect (name, value, type = StateConfig.TYPE_STRING) {
      this.addStateValue(name, value, type);
      this.addSetEffect(name, type);
    }

    addStateAndBoolEffect (name, value) {
      this.addStateValue(name, !!value, StateConfig.TYPE_BOOLEAN);
      this.addBoolEffect(name);
    }

    get middleware () {
      return this._middleware.slice(0);
    }

    toHash () {
      return {
        effects: this.effects,
        initialState: this.initialState,
        middleware: this.middleware
      }
    }
  })


}