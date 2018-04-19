import wsi from "./worldSceneInjector"

export default (bottle) => {
  bottle.factory('worldSceneInjector', (container) => wsi)
}