import {IcosahedronGeometry} from 'three';
import WorldTiler from '../../../../src/lib/scene/WorldTiler/index';

describe('lib', () => {
  describe('scene', () => {
    describe('WorldTiler', () => {
      describe('World', () => {

        const beforeEach = () => {
          const sphere = new IcosahedronGeometry(1, 0);
          const bottle = WorldTiler();
          const world = new bottle.container.World(sphere);

          return {world, bottle, sphere}
        };

        it('should be created', () => {
          const {world, sphere} = beforeEach();
          expect(world.geometry).toEqual(sphere);
        });

        describe('.init', () => {
          const {world} = beforeEach();

          world.init();

          let isoFace4 = world.isoFaces.get(4);
        });
      });
    });
  });
});