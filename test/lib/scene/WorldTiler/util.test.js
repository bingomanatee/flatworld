import {IcosahedronGeometry, Vector3} from 'three';
import WorldTiler from '../../../../src/lib/scene/WorldTiler/index';

describe('lib', () => {
  describe('scene', () => {
    describe('WorldTiler', () => {
      describe('util', () => {
        describe('numSort', () => {
          it('should sort numerically', () => {
            const bottle = WorldTiler();
            expect(bottle.container.numSort([1, 2])).toEqual([1, 2]);
            expect(bottle.container.numSort([3, 2])).toEqual([2, 3]);
          });
        });

        describe('setsEqual', () => {
          const bottle = WorldTiler();
          let set1 = new Set([1, 2]);
          let set2 = new Set([2, 1]);
          let set3 = new Set([1, 2, 3]);
          expect(bottle.container.setsEqual(set1, set2)).toBeTruthy();
          expect(bottle.container.setsEqual(set1, set3)).toBeFalsy();
        });
      });
    });
  });
});