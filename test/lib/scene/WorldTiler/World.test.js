import {IcosahedronGeometry} from 'three';
import WorldTiler from '../../../../src/lib/scene/WorldTiler/index';
import _ from 'lodash';

describe('lib', () => {
  describe('scene', () => {
    describe('WorldTiler', () => {
      describe('World', () => {

        const beforeEach = (size = 0) => {
          const sphere = new IcosahedronGeometry(1, size);
          const bottle = WorldTiler();
          const world = new bottle.container.World(sphere);

          return {world, bottle, sphere}
        };

        it('should be created', () => {
          const {world, sphere} = beforeEach();
          expect(world.geometry)
            .toEqual(sphere);
        });

        describe('.init', () => {

          it('should find all the edges of a face', () => {
            const {world, bottle, sphere} = beforeEach();

            world.init();

            let isoFace4 = world.isoFaces.get(4);

            let face = isoFace4.face;
            let edge1 = bottle.container.numSort([face.a, face.b]);
            expect(Array.from(isoFace4.faceEdges.values())
                        .find((edge) => _.isEqual(edge1, edge.orderedIndexes)))
              .toBeTruthy();
            let edge2 = bottle.container.numSort([face.a, face.c]);
            expect(Array.from(isoFace4.faceEdges.values())
                        .find((edge) => _.isEqual(edge2, edge.orderedIndexes)))
              .toBeTruthy();
            let edge3 = bottle.container.numSort([face.c, face.b]);
            expect(Array.from(isoFace4.faceEdges.values())
                        .find((edge) => _.isEqual(edge3, edge.orderedIndexes)))
              .toBeTruthy();
          });

          it('should have related faces ', () => {
            const {world, bottle, sphere} = beforeEach(2);

            world.init();

            let point = world.points.get(20);

            let faceList = Array.from(point.pointIsoFaces.values());
            let faceIndexes = _.map(faceList, 'faceIndex');

          expect(bottle.container.setsEqual(
              new Set([24, 25, 26, 28, 29, 30]),
              new Set(faceIndexes)))
              .toBeTruthy();
          });

          // it('should make neighbor rings from points ', () => {
          //   const {world, bottle, sphere} = beforeEach(2);
          //
          //   world.init();
          //
          //   let point = world.points.get(20);
          //
          //   let ringIndexes = _.map(point.neighborRing, 'vertexIndex');
          //
          //   expect(ringIndexes)
          //     .toEqual([19, 16, 17, 21, 23, 22]);
          // });
          it('should make neighbor faces ', () => {
            const {world, bottle, sphere} = beforeEach(2);

            world.init();

            let point = world.points.get(20);

            let ringIndexes = _.map(point.faceRing, 'faceIndex');

            expect(ringIndexes)
              .toEqual([25, 24, 28, 29, 30, 26]);
          });
        });
      });
    });
  });
});