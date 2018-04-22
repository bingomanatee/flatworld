import Bottle from 'bottlejs';
import state from './state';
import scene from './scene';
import {injectState} from 'freactal';
import {withRouter} from 'react-router-dom';
import {Camera, Vector2, Vector3} from 'three';
export default () => {
  let bottle = new Bottle();
  bottle.constant('Vector2', Vector2);
  bottle.constant('Vector3', Vector3);
  bottle.constant('Camera', Camera);

  state(bottle);
  scene(bottle);
  bottle.constant('withRouter', withRouter);
  bottle.constant('injectState', injectState);

  return bottle;
}