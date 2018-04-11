import {Vector2} from 'three';
export default (bottle) => {
  bottle.factory ('floatToString', () => (n) => Number.parseFloat(n).toFixed(3));
  bottle.factory('numSort', () =>  (array) => array.sort((a, b) => a - b));
  bottle.factory('percent', () => (n) => `${Number.parseFloat(n * 100).toFixed(1)}%`)
  bottle.factory('setsEqual', () => function setsEqual(s1, s2) {
      if (s1.size !== s2.size) {
        return false;
      }
      for (let e of s1) if (!s2.has(e)) {
        return false;
      }
      for (let e of s2) if (!s1.has(e)) {
        return false;
      }
      return true;
    });

  bottle.factory('pointToUvVertex', () => (point, size) => point.meanUv.clone()
                                                                .multiplyScalar(size))
}