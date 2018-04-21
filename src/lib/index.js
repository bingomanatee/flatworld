import Bottle from 'bottlejs';
import state from './state';
import scene from './scene';
import {injectState} from 'freactal';
import {withRouter} from 'react-router-dom';

export default () => {
  let bottle = new Bottle();
  state(bottle);
  scene(bottle);
  bottle.constant('withRouter', withRouter);
  bottle.constant('injectState', injectState)
  return bottle;
}