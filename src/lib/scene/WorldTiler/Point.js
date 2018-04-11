import _ from 'lodash'
import {Vector2} from 'three';

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
  constructor (vertex, vertexIndex, world) {
    super(world);
    this.vertex = vertex;
    this.vertexIndex = vertexIndex;
    this.world = world;
    this.uvs = new Set();
    this.pointEdges = new Set();
    this.points.set(vertexIndex, this);
    this.pointIsoFaces = new Set();
  }

  uvStrings () {
    return Array.from(this.uvs.values())
                .map((uv) => `(uv ${container.percent(uv.x)}, ${container.percent(uv.y)}`);
  }

  toString (withUVs) {
    let uvs = withUVs ? "\nUVs: " + this.uvStrings()
                                        .join("\n") : '';
    let out = `<< point index ${this.vertexIndex} at (${this.vertex.toArray()
                                                            .map(container.floatToString)
                                                            .join(',')}) -- ${uvs} >>`;
    return out;
  }

  initUV () {
    let u = [];
    let v = [];

    for (let uv of this.uvs) {
      u.push(uv.x % 1);
      v.push(uv.y % 1);
    }

    this.meanUV = new Vector2(_.mean(u), _.mean(v));
  }

  neighborPointNodes () {
    let neighborEdges = _(Array.from(this.pointIsoFaces.values()))
      .map((isoFace) => Array.from(isoFace.faceEdges.values()))
      .flattenDeep()
      .filter((edge) => !edge.orderedIndexes.includes(this.vertexIndex))
      .value();

    let nodeMap = new Map();
    let nodes = _(neighborEdges)
      .map('edgePoints')
      .flattenDeep()
      .uniq()
      .map((point) => new container.PointNode(point, nodeMap))
      .value();

    for (let edge of neighborEdges) {
      for (let node of nodes) {
        node.link(edge);
      }
    }
    return nodeMap;
  }

  neighborFaceNodes () {
    let nodeMap = new Map();
    let nodes = _(Array.from(this.pointIsoFaces.values()))
      .map((face) => new container.FaceNode(this, face, nodeMap))
      .value();

    for (let edge of this.pointEdges.values()) {
      for (let node of nodes) {
        node.link(edge);
      }
    }
    return nodeMap;
  }

  get neighborRing () {
    if (!this._neighborRing) {
      let nnMap = this.neighborPointNodes();
      this._neighborRing = Array.from(nnMap.values())[0].ring()
                                                        .map((node) => node.point);
    }
    return this._neighborRing;
  }

  get faceRing () {
    if (!this._faceRing) {
      let faceNodeMap = this.neighborFaceNodes();
      this._faceRing = Array.from(faceNodeMap.values())[0].ring()
                                                          .map((node) => node.face);
    }
    return this._faceRing;
  }

  init () {
    this.initUV();
  }

  drawHexFrame (hex, size) {
    let uvList = this.faceRing.map((face) => container.pointToUvVertex(face, size));
    uvList = Point.unifyUVs(uvList, size);
    let last = _.last(uvList);
    hex.graphics.s('black')
       .mt(last.x, last.y);
    for (let uv of uvList) {
      hex.graphics.lt(uv.x, uv.y);
    }
    hex.graphics.es();
    return hex;
  }

  static unifyUVs (uvList, size) {
    let maxDistance = _(uvList)
      .map((uvPoint) => {
        return _.map(uvList, (p2) => p2.distanceTo(uvPoint));
      })
      .flattenDeep()
      .max();


    let mostPopPoint = _.reduce(uvList, (popList, uv) => {
      let otherPoints = _(uvList)
        .difference([uv])
        .filter((otherUv) => {
          return otherUv.distanceTo(uv) < size/4
        })
        .value();
      if (otherPoints.length > popList.points.length) {
        return {points: otherPoints, uv}
      } else {
        return popList
      }
    },{points: [], uv: null})

    let popularSet = mostPopPoint.points;
    popularSet.push(mostPopPoint.uv);
    let otherPoints = _.difference(uvList, popularSet);

    if (maxDistance > size/4) {
      console.log('max distance: ', maxDistance, size/4);
      console.log('popularSet:', popularSet);
      console.log('otherPoints: ', otherPoints);
    } else {
      console.log('GOOD max distance: ', maxDistance, size/4);
    }
    return uvList;
  }
});

class UvPointSet {

  constructor (firstMember) {
    this.points = [];
    if (firstMember) {
      this.points.push(firstMember);
    }
  }

  greatestDistanceTo (pt) {
    return _.max(this.points.map((pt2) => pt.distanceTo(pt)));
  }

  add (pt) {
    this.points.push(pt);
  }
}


