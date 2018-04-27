import StateConfig from './StateConfig';
import {update, provideState, injectState} from 'freactal';
import worldDefState from './worldDefState';
import {withRouter} from 'react-router-dom';

export default (bottle) => {
  StateConfig(bottle);
  bottle.factory('stateDef', (container) => new container.StateConfig());
  bottle.constant('update', update);
  bottle.constant('provideState', provideState);
  bottle.constant('injectState',  injectState);
  bottle.constant('withRouter',  withRouter);
  bottle.factory('wrapComponentWithState', (container) => container.provideState(container.stateDef));
  worldDefState(bottle);

  return bottle;
}