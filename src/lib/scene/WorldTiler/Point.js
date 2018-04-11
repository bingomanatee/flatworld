import WorldElement from './WorldElement';

/**
 * a wrapper around Vector3 with associated data and links
 *
 * @param bottle {Bottle}
 */
export default (bottle) => bottle.factory('Point', (container) => class Point extends container.WorldElement {

  /**
   *
   * @param vertex {Vector3}
   * @param vertexIndex {int}
   * @param world {World}
   */
  constructor(vertex, vertexIndex, world) {
    super(world);
    this.vertex = vertex;
    this.vertexIndex = vertexIndex;
    this.world = world;
    this.uvs = new Set();
    this.pointIsoFaces = new Set();
    this.pointEdges = new Set();
    this.points.set(vertexIndex, this);
  }

  toString() {
    let out = `<< point at (${this.vertex.toArray().join(',')}) uvs: [`;
    for (let uv of this.uvs) {
      out += "\n" + uv.toArray().join(',');
    }
    out += '] >>';
    return out;
  }
});