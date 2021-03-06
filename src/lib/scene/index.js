import wsi from "./worldSceneInjector"
import SceneSubject from './SceneSubject';
import CanvasTextureManager from './CanvasTextureManager';
import CTMHex from './CTMHex';
import SceneManager from './SceneManager';
import WindParticle from './WindParticle';

import axios from 'axios';

export default (bottle) => {
  bottle.constant('worldSceneInjector', wsi);
  bottle.constant('axios', axios);
  SceneSubject(bottle);
  CTMHex(bottle);
  CanvasTextureManager(bottle);
  SceneSubject(bottle);
  SceneManager(bottle);
  WindParticle(bottle);
}