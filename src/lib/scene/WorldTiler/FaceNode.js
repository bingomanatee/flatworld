import _ from "lodash";

export default (bottle) => bottle.factory('FaceNode', (container) => class PointNode extends container.PathNode {
  constructor(point, face, nodeMap) {
    super(face.faceIndex, face.meanUv, nodeMap);
    this.point = point;
    this.face = face;
  }

  linkEdge(edge) {
    if (edge.hasFace(this.face)) {
      let otherFace = edge.otherFace(this.face);
      let otherFaceNode = this.registry.get(otherFace.faceIndex);
      if (!otherFaceNode) {
      } else {
        this.link(otherFaceNode);
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * Because the faces can be split on the seam, drawing a point
   * from one faces' midpoint to the other is problematic. Instead we
   * are drawing edges from the faces' midpoints to the faces edge midpoint.
   *
   * @param hex {Shape}
   * @param size {int}
   */
  drawHexFramePart(hex, size) {
    for (let edge of this.face.faceEdges) {
      if (edge.hasPoint(this.point)) {
        let faceVertexIndexes = edge.orderedIndexes.map((vi) => this.face.faceVertexIndexes.indexOf(vi));
        let midpointUvs = faceVertexIndexes.map((index) => this.face.myFaceUvs[index]);
        let midpointUv = midpointUvs[0].clone().lerp(midpointUvs[1], 0.5);
        hex.graphics.s('black');
        container.lineShape(hex, [this.face.meanUv, midpointUv], size);
        hex.graphics.es();
      }
    }
  }

  toString() {
    let point = this.point;
    return `<< node of point ${point.toString()} -- face ${this.id} 
      links: ${_(Array.from(this.edges.values()))
      .compact()
      .map('id')
      .join(",")}
    >>`
  }
});