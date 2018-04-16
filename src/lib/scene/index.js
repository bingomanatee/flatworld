import three from "three"

export default (bottle) => {
  bottle.factory('threeInjector', (container) => three)
}