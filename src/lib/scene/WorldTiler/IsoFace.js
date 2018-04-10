export default (bottle) => bottle.factory('IsoFace', (container) => class IsoFace extends container.WorldElement {

  /**
   * a utility class that wraps a THREE face in utility methods
   * @param face {Face3}
   * @param index {int}
   * @param world {World}
   */
  constructor(face, index, world) {
    super(world);
    this.face = face;
    this.faceIndex = index;
    this.faceVertexIndexes = [this.face.a, this.face.b, this.face.c];
    this.isoFaces.set(index, this);
  }

  init() {
    this.facePoints = this.faceVertexIndexes.map((vertexIndex) => this.points.get(vertexIndex));
    this.copyUvs();
    this.linkEdges();
  }

  copyUvs() {
    this.eachPoint((point, indexOfVertexInFace) => {
      point.uvs.add(this.myFaceUvs[indexOfVertexInFace]);
    });
  }

  get myFaceUvs () {
    return this.faceUvs[this.faceIndex];
  }


  eachPoint(delta) {
    return this.faceVertexIndexes.map((vertexIndex, indexOfVertexInFace) => {
      let viPoint = this.points.get(vertexIndex);
     return delta(viPoint, indexOfVertexInFace, this);
    });
  }

  linkEdges() {
    let edgeVertexIndexes = this.eachPoint((point, indexOfVertexInFace, isoFace) => {
      let nextIndex = (indexOfVertexInFace + 1) % 3;
      return [this.faceVertexIndexes[indexOfVertexInFace], this.faceVertexIndexes[nextIndex]];
    });

    this.faceEdges = new Set(edgeVertexIndexes.map((viArray) => container.FaceEdge.findOrMakeEdge(viArray)))
  }
});