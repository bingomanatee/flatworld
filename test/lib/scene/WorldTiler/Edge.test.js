import {Vector3} from 'three';
import WorldTiler from '../../../../src/lib/scene/WorldTiler/index';
import _ from 'lodash';

describe('lib', () => {
  describe('scene', () => {
    describe('WorldTiler', () => {
      describe('Edge', () => {
        const beforeEach = () => {
          const mockWorld = {
            points: new Map(),
            edges: new Map()
          };
          const bottle = WorldTiler();
          const point4 = new bottle.container.Point(new Vector3(), 4, mockWorld);
          const point5 = new bottle.container.Point(new Vector3(), 5, mockWorld);
          mockWorld.points.set(point4, 4);
          mockWorld.points.set(point5, 5);

          const edge = new bottle.container.FaceEdge(4, 5, mockWorld)
          return {mockWorld, bottle, point4, point5, edge};
        };

        it('constructor', () => {
          const {mockWorld, bottle, point4, point5, edge} = beforeEach();

          expect(_.isEqual(edge.orderedIndexes, [4, 5]))
            .toBeTruthy();
          expect(edge.world)
            .toBe(mockWorld);
        });

        it('.otherPoint', () => {
          const {mockWorld, bottle, point4, point5, edge} = beforeEach();

          let otherPoint = edge.otherPoint(point4);
          expect(_.isEqual(otherPoint, point5))
            .toBeTruthy();
        });
      });
    });
  });
});