import Bottle from 'bottlejs';
import state from './state';
import scene from './scene';
import Generator from './Generator';
import {injectState, update, mergeIntoState} from 'freactal';
import {withRouter} from 'react-router-dom';
import {Camera, Vector2, Vector3} from 'three';

export default () => {
  let bottle = new Bottle();
  bottle.constant('Vector2', Vector2);
  bottle.constant('Vector3', Vector3);
  bottle.constant('Camera', Camera);
  bottle.constant('SERVER_API', 'http://flatworld.studio:7070');

  state(bottle);
  scene(bottle);
  Generator(bottle);

  bottle.constant('withRouter', withRouter);
  bottle.constant('injectState', injectState);
  bottle.constant('update', update);
  bottle.constant('mergeIntoState', mergeIntoState);

  return bottle;
}