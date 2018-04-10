import {Face3, Vector2, Vector3} from 'three';
import WorldTiler from '../../../../src/lib/scene/WorldTiler/index';

function setsEqual(s1, s2) {
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
}

describe('lib', () => {
  describe('scene', () => {
    describe('WorldTiler', () => {
      describe('Face', () => {
        const init = () => {
          const mockWorld = {
            points: new Map(),
            isoFaces: new Map(),
            faceUvs: []
          };
          const v1 = new Vector3(1, 2, 3);
          const v2 = new Vector3(4, 5, 6);
          const v3 = new Vector3(7, 8, 9);

          const mockIsoPoint1 = {
            vertex: v1, uvs: new Set()
          };
          const mockIsoPoint2 = {
            vertex: v2, uvs: new Set()
          };
          const mockIsoPoint3 = {
            vertex: v3, uvs: new Set()
          };

          const V1_INDEX = 11;
          const V2_INDEX = 12;
          const V3_INDEX = 10;

          mockWorld.points.set(V1_INDEX, mockIsoPoint1);
          mockWorld.points.set(V2_INDEX, mockIsoPoint2);
          mockWorld.points.set(V3_INDEX, mockIsoPoint3);

          mockWorld.points.set(V1_INDEX, mockIsoPoint1);
          mockWorld.points.set(V2_INDEX, mockIsoPoint2);
          mockWorld.points.set(V3_INDEX, mockIsoPoint3);

          const face = new Face3(V1_INDEX, V2_INDEX, V3_INDEX);
          const FACE_INDEX = 4;

          mockWorld.faceUvs[FACE_INDEX] = [new Vector2(0.5, 0), new Vector2(0.5, 0), new Vector2(0.5, 0.5)];
          const bottle = WorldTiler();
          const IsoFace = bottle.container.IsoFace;
          const isoFace = new IsoFace(face, FACE_INDEX, mockWorld);
          return {
            mockWorld, bottle, v1, v2, v3, face, isoFace,
            FACE_INDEX, V1_INDEX, V2_INDEX, V3_INDEX
          };
        };

        it('constructor', () => {
          const {
            mockWorld, bottle, v1, v2, v3, face, isoFace,
            FACE_INDEX, V1_INDEX, V2_INDEX, V3_INDEX
          } = init();

          expect(isoFace.faceIndex).toBe(FACE_INDEX);
          expect(isoFace.world).toBe(mockWorld);
        });

        it('should have the expected vertex indexes', () => {
          const {
            mockWorld, bottle, v1, v2, v3, face, isoFace,
            FACE_INDEX, V1_INDEX, V2_INDEX, V3_INDEX
          } = init();

          expect(setsEqual(new Set([V1_INDEX, V2_INDEX, V3_INDEX]), new Set(isoFace.faceVertexIndexes))).toBe(true);
        });

        it('should self register', () => {
          const {
            mockWorld, bottle, v1, v2, v3, face, isoFace,
            FACE_INDEX, V1_INDEX, V2_INDEX, V3_INDEX
          } = init();

          expect(mockWorld.isoFaces.get(FACE_INDEX)).toEqual(isoFace);
        });
      });
    });
  });
});