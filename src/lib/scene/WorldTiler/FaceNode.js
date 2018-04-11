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
    return `<< node of point ${point.toString()} -- face ${this.faceIndex} 
      links: ${Array.from(this.linkedFaceNodes.values())
                    .map(node => node.faceIndex)
                    .join(",")}
    >>`
  }

  get faceIndex () {
    return this.face.faceIndex;
  }

  ring () {
    let lastFaceNodeLinks = Array.from(this.linkedFaceNodes.values());
    let ring = [lastFaceNodeLinks[0], this, lastFaceNodeLinks[1]];
    let failsafe = 0;
    do {
      let lastNode = _.last(ring);
      lastFaceNodeLinks = Array.from(lastNode.linkedFaceNodes.values());

      let nextFaceNode = _.difference(lastFaceNodeLinks, ring)[0]
      if (nextFaceNode) {
        ring.push(nextFaceNode);
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