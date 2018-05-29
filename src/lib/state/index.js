import StateConfig from './StateConfig';
import {update, provideState, injectState} from 'freactal';
import worldDefState from './worldDefState';
import authState from './authState';
import {withRouter} from 'react-router-dom';

export default (bottle) => {
  StateConfig(bottle);
  bottle.factory('stateDef', (container) => {
    const def = new container.StateConfig();
    def.useLocalStorage(true);
    return def;
  });
  bottle.constant('update', update);
  bottle.constant('provideState', provideState);
  bottle.constant('injectState',  injectState);
  bottle.constant('withRouter',  withRouter);
  bottle.factory('wrapComponentWithState', (container) => container.provideState(container.stateDef.toHash()));
  worldDefState(bottle);
  authState(bottle);
  return bottle;
}