import StateConfig from './StateConfig';
import {update, provideState, injectState} from 'freactal';
import worldDefState from './worldDefState';

export default (bottle) => {
  StateConfig(bottle);
  bottle.factory('stateDef', (container) => new container.StateConfig());

  bottle.factory('update', () => update);
  bottle.factory('provideState', () => provideState);
  bottle.factory('injectState', () => injectState);
  bottle.factory('withRouter', () => withRouter);
  bottle.factory('wrapComponentWithState', (container) => container.provideState(container.stateDef))
  worldDefState(bottle);

  return bottle;
}