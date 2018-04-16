import Bottle from 'bottlejs';
import state from './state';
import {withRouter} from 'react-router-dom';

export default () => {
  let bottle = new Bottle();
  state(bottle);
  scene(bottle);
  bottle.factory('withRouter', () => withRouter);

  return bottle;
}