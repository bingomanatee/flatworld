import _ from 'lodash'
import {Vector2} from 'three';
import {createjs} from "@createjs/easeljs";

const {Stage, Shape, Text, Container} = createjs;

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

    this.meanUv = new Vector2(_.mean(u), _.mean(v));
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

  get neighborRing () {
    if (!this._neighborRing) {
      let nnMap = this.neighborPointNodes();
      this._neighborRing = Array.from(nnMap.values())[0].ring()
        .map((node) => node.point);
    }
    return this._neighborRing;
  }

  neighborFaceNodes () {
    let nodeMap = new Map();
    let nodes = Array.from(this.pointIsoFaces.values())
      .map((face) => new container.FaceNode(this, face, nodeMap));

    for (let edge of this.pointEdges.values()) {
      for (let node of nodes) {
        node.linkEdge(edge);
      }
    }
    return nodeMap;
  }

  get faceRing () {
    if (!this._faceRing) {
      let faceNodeMap = this.neighborFaceNodes();
      this._faceRing = Array.from(faceNodeMap.values())[0].ring();
    }
    return this._faceRing;
  }

  init () {
    this.initUV();
  }

  drawHexFrame (hex, size) {
    const ring = this.faceRing;
    for (let faceNode of ring) {
      faceNode.drawHexFramePart(hex, size);
    }
  }

  distanceToSquared(p){
    return this.vertex.distanceToSquared(p.vertex);
  }

  get x () {
    return this.point.x;
  }

  get y () {
    return this.point.y;
  }

  get z () {
    return this.point.z;
  }

  initCanvasHex(alpha, stage, size){
    this._canvasHex = new Shape();
    this._canvasHex.alpha = alpha;
    stage.addChild(this._canvasHex);

    if (this.isSplit) {

    } else {
      this._canvasHex.f('white');
      container.moveToShape(this._canvasHex, _.last(this.neighborRing).point.meanUv, size)
      for (let node of this.neighborRing) {
        container.lineToShape(this._canvasHex, node.point.meanUv, size)
      }
    }
  }

  /**
   * paints or increases the hexagon with increased Alpha
   *
   * @param alpha
   * @param stage
   * @param size
   * @returns {boolean}
   */
  paintHex(alpha, stage, size) {
    if (!this.canvasHex) {
      this.initCanvasHex(alpha, stage, size);
      return true;
    } else if (this.canvasHex.alpha < 1) {
      this.canvasHex.alpha = _.clamp(this.canvasFace.alpha + alpha, 1);
      return true;
    } else {
      return false;
    }
  }
});

