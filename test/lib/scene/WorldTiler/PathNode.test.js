import {IcosahedronGeometry, Vector3} from 'three';
import WorldTiler from '../../../../src/lib/scene/WorldTiler/index';
import _ from "lodash";

describe('lib', () => {
  describe('scene', () => {
    describe('WorldTiler', () => {
      describe('PathNode', () => {
        const beforeEach = () => {
          const bottle = WorldTiler();
          const reg = new Map;
          let pt = new Vector3();
          const FIRST_NODE_ID = 1;
          const PathNode = bottle.container.PathNode;
          let node = new PathNode(FIRST_NODE_ID, pt, reg);
          return {PathNode, FIRST_NODE_ID, reg, bottle, node};
        };

        it('constructor', () => {
          const {node, FIRST_NODE_ID, reg} = beforeEach();
          expect(node.id).toBe(FIRST_NODE_ID);
          expect(node.registry).toEqual(reg);
        });

        it('should self register', () => {
          const {node, reg, FIRST_NODE_ID} = beforeEach();
          expect(reg.get(FIRST_NODE_ID)).toEqual(node);
        });

        describe('.ring', () => {
          it('should link nodes', () => {
            const {node, PathNode, FIRST_NODE_ID, reg} = beforeEach();
            const NODE_2_ID = 10;
            const NODE_3_ID = 20;
            const NODE_4_ID = 23;
            let node2 = new PathNode(NODE_2_ID, new Vector3(), reg);
            let node3 = new PathNode(NODE_3_ID, new Vector3(), reg);
            let node4 = new PathNode(NODE_4_ID, new Vector3(), reg);

            node2.link(node);
            node3.link(node2);
            node4.link(node3);
            node4.link(node);

            let ring = _.map(node.ring(), 'id');
            expect(ring).toEqual([10, 1, 23, 20]);
          });
        });
      });
    });
  });
});