import {IcosahedronGeometry} from 'three';
import WorldTiler from '../../../../src/lib/scene/WorldTiler/index';

describe('lib', () => {
  describe('scene', () => {
    describe('WorldTiler', () => {
      describe('World', () => {
        it('should be created', () => {
          const sphere = new IcosahedronGeometry(1, 0);
          expect(sphere.vertices.length).toBe(12);
          const bottle = WorldTiler();
          const world = new bottle.container.World(sphere);
          expect(world.geometry).toEqual(sphere);
        });
      });
    });
  });
});