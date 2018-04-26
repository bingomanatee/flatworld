import wsi from "./worldSceneInjector"
import SceneSubject from './SceneSubject';
import CanvasTextureManager from './CanvasTextureManager';
import SceneManager from './SceneManager';
import axios from 'axios';

export default (bottle) => {
  bottle.constant('worldSceneInjector', wsi);
  bottle.constant('axios', axios);
  SceneSubject(bottle);
  CanvasTextureManager(bottle);
  SceneSubject(bottle);
  SceneManager(bottle);
}