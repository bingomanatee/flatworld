import _ from "lodash";

export default (bottle) => bottle.factory('PointNode', (container) => class PointNode {
  constructor (point, nodeMap) {
    this.point = point;
    this.linkedFaceNodes = new Set();
    this.nodeMap = nodeMap;
    nodeMap.set(point.vertexIndex, this);
  }

  link (edge) {
    if (edge.hasPoint(this.point)) {
      let otherPoint = edge.otherPoint(this.point);
      let otherNode = this.nodeMap.get(otherPoint.vertexIndex);
      this.linkedFaceNodes.add(otherNode);
    }
  }

  toString () {
    let point = this.point;
    return `<< node of point ${point.toString()}} 
      links: ${Array.from(this.linkedFaceNodes.values())
                    .map(node => node.point.vertexIndex)
                    .join(",")}
    >>`
  }

  get vertexIndex () {
    return this.point.faceIndex;
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