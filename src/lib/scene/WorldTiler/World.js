/**
 * A utility class for an IsoSphere that converts points into hexagons.
 * @param bottle {Bottle}
 */
let kdt = require('kd-tree-javascript');

export default (bottle) => bottle.factory('World', (container) => class World {

  /**
   *
   * @param geometry {IcosahedronGeometry }
   */
  constructor(geometry) {
    this.geometry = geometry;
    this.edges = new Map();
    this.faceUvs = this.geometry.faceVertexUvs[0];
    this.isoFaces = new Map();
    this.points = new Map();
  }

  vertsToPoints() {
    this.geometry.vertices.forEach((vert, index) => new container.Point(vert, index, this));
  }

  facesToIsoFace() {
    this.geometry.faces.forEach((face, index) => new container.IsoFace(face, index, this));
  }

  init() {
    this.vertsToPoints();
    this.facesToIsoFace();
    for (let isoFace of this.isoFaces.values()) {
      isoFace.init();
    }

    for (let point of this.points.values()) {
      point.init();
    }
    this.indexNearFaces();
  }

  nearestPoint(pt) {
    let nearest = this._nearPointIndex(pt);
    if (!nearest) return false;
    return nearest[0][0];
  }

  indexNearPoints() {
    this._nearPointIndex = new kdt.kdTree(this.points, (a, b) => {
      return a.distanceToSquared(b);
    }, ['x', 'y', 'z']);
  }
});