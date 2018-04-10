import {IcosahedronGeometry, Vector3} from 'three';
import WorldTiler from '../../../../src/lib/scene/WorldTiler/index';

describe('lib', () => {
  describe('scene', () => {
    describe('WorldTiler', () => {
      describe('Point', () => {
        const init = () => {
          const mockWorld = {
            points: new Map()
          };
          const bottle = WorldTiler();
          const point = new bottle.container.Point(new Vector3(), 4, mockWorld);
          return {mockWorld, bottle, point};
        };

        it('constructor', () => {
          const {bottle, mockWorld, point} = init();

          expect(point.vertexIndex).toBe(4);
          expect(point.world).toBe(mockWorld);
        });

        it('should self register', () => {
          const {bottle, mockWorld, point} = init();
          expect(point.vertexIndex).toBe(4);
          expect(mockWorld.points.get(4)).toEqual(point);
        });
      });
    });
  });
});