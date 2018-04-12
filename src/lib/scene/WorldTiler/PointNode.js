import _ from "lodash";

export default (bottle) => bottle.factory('PointNode', (container) => class PointNode extends container.PathNode {
  constructor (point, nodeMap) {
    super(point.vertexIndex, point, nodeMap);
  }

  linkEdge (edge) {
    if (edge.hasPoint(this.point)) {
      let otherPoint = edge.otherPoint(this.point);
      let otherNode = this.nodeMap.get(otherPoint.vertexIndex);
      this.link(otherNode);
      return true;
    }
  }

  toString () {
    let point = this.point;
    return `<< node of point ${point.toString()}} 
      links: ${Array.from(this.linkedFaceNodes.values())
                    .map(node => node.id)
                    .join(",")}
    >>`
  }

});