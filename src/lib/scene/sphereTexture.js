import {createjs} from "@createjs/easeljs";
import Ticker from './Ticker';
import WorldTiler from './WorldTiler';

let bottle = WorldTiler();

const {Stage, Shape, Text, Container} = createjs;
//eval('debugger ');
import _ from 'lodash';

const canvas = document.createElement('canvas');
document.getElementById("root").parentNode.appendChild(canvas);

const SIZE = 1024 * 4;
canvas.width = SIZE;
canvas.height = SIZE;
canvas.id = 'texture';
const stage = new Stage(canvas);
let bg = new Shape();
bg.graphics.f('rgba(0,0,0,0.5)').drawRect(0, 0, SIZE, SIZE);
stage.addChild(bg);
stage.update();

const uvXtoGraphicsX = (x) => Math.round(x/2 * SIZE + SIZE / 2) % SIZE;

const tooWide = (points) => {
  let xWidth = _.max(_.map(points, 'x')) - _.min(_.map(points, 'x'));
  return (xWidth > SIZE / 5);
}

const blendAlphas = (a1, a2) => {
  return 1 - ((1 - a1) * (1 - a2));
}

function addCell(cell,alpha, name) {
  if (!cell.halfedges.length) return;

  let vertices = _.reduce(cell.halfedges, (list, edge) => {
    let others = [edge.edge.va, edge.edge.vb];
    return _(list.concat(others))
      .uniq()
      .value();
  }, []);

  let cellShape = new Shape();
  //cellShape.alpha = alpha;
  cellShape.name = name;
  cellShape.graphics.f('white');
  drawPolyRing(cellShape, vertices);
  stage.addChild(cellShape);
  debounceFHC();
}

function paintHex (point, alpha) {
  let nearest = world.nearestPoint(point);
  if (nearest) {
    if (nearest.paintHex(alpha)) {
      debounceFHC();
      stage.update();
    }
  }
}

function addSpot (vertex) {
  paintHex(vertex, 0.2);
 stage.update();
}

let hexGridShape = new Shape();
stage.addChild(hexGridShape);

const drawPolyRing = (shape, uvs) => {
  let last = _.last(uvs);
  shape.graphics.mt(uvXtoGraphicsX(last.x), last.y * SIZE);
  uvs.forEach((pt) => shape.graphics.lt(uvXtoGraphicsX(pt.x), pt.y * SIZE));
};

const jiggle = (n) => n //+ (Math.random() - 0.5) / 1000;
let world;

export const initWorld = (geometry) => {
  world = new bottle.container.World(geometry);
  world.init();
  for (let point of world.points.values()) {
    point.drawHexFrame(hexGridShape, SIZE);
  }
  hexGridShape.cache(0,0,SIZE, SIZE);
 /*let fvUVs = new Shape();
  for (let uvSet of geometry.faceVertexUvs[0]) {
    fvUVs.graphics.s('red');
    let pts = uvSet.map((pt) => pt.clone().multiplyScalar(SIZE));

    let last = _.last(pts);
    fvUVs.graphics.mt(last.x, last.y);
    for (let pt of pts) { fvUVs.graphics.lt(pt.x, pt.y); }
    fvUVs.graphics.es();
  }
  stage.addChild(fvUVs); */

  floatHexContainer();
};

const floatHexContainer = () => {
  stage.removeChild(hexGridShape);
  stage.addChild(hexGridShape);
  stage.update();
};

const debounceFHC = _.debounce(floatHexContainer, 500);

export const paintAt = (vertex) => {

  if (mouseDown) {
    addSpot(vertex);
    floatHexContainer();
  }
};

let mouseDown = false;
let mouse2Down = false;
export const setMouseDown = (isDown, is2Down) => {
  mouseDown = isDown;
  mouse2Down = is2Down;
};

export default canvas;