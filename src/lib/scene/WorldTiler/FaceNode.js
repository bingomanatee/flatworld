import _ from "lodash";

export default (bottle) => bottle.factory('FaceNode', (container) => class PointNode {
  constructor (point, face, nodeMap) {
    this.point = point;
    this.face = face;
    this.linkedFaceNodes = new Set();
    this.nodeMap = nodeMap;
    nodeMap.set(face.faceIndex, this);
  }

  link (edge) {
    if (edge.hasFace(this.face)) {
      let otherFace = edge.otherFace(this.face);
      let otherFaceNode = this.nodeMap.get(otherFace.faceIndex);
      this.linkedFaceNodes.add(otherFaceNode);
    }
  }

  toString () {
    let point = this.point;
    return `<< node of point ${point.toString()}} 
      links: ${Array.from(this.linkedFaceNodes.values())
                    .map(node => node.faceIndex)
                    .join(",")}
    >>`
  }

  get faceIndex () {
    return this.face.faceIndex;
  }

  ring () {
    let lastNodeLinks = Array.from(this.linkedFaceNodes.values());
    let ring = [lastNodeLinks[0], this, lastNodeLinks[1]];
    let failsafe = 0;
    do {
      let lastNode = _.last(ring);
      lastNodeLinks = Array.from(lastNode.linkedFaceNodes.values());

      let nextNode = _.difference(lastNodeLinks, ring)[0]
      if (nextNode) {
        ring.push(nextNode);
      } else {
        break;
      }
      ++failsafe;

      if (failsafe > 8) {
        break;
      }
    } while (true);
    return ring;
  }
});