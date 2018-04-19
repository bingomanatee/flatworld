import wsi from "./worldSceneInjector"
import SceneSubject from './SceneSubject';
import TextureManager from './TextureManager';

export default (bottle) => {
  bottle.constant('worldSceneInjector', wsi);
  SceneSubject(bottle);
  TextureManager(bottle);
  SceneSubject(bottle);
}