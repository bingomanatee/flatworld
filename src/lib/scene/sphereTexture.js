import {createjs} from "@createjs/easeljs";
import Ticker from './Ticker';

console.log('createjs: ', createjs, 'ticker', Ticker);
const {Stage, Shape, Text} = createjs;
//eval('debugger ');
import _ from 'lodash';

const canvas = document.createElement('canvas');
document.getElementById("root").parentNode.appendChild(canvas);

const SIZE = 1024;
canvas.width = SIZE;
canvas.height = SIZE;
canvas.id = 'texture';
const stage = new Stage(canvas);
let bg = new Shape();
bg.graphics.f('black').drawRect(0, 0, SIZE, SIZE);
stage.addChild(bg);
stage.update();

const shiftX = (x) => (x + SIZE / 2) % SIZE;

const tooWide = (points) => {
  let xWidth = _.max(_.map(points, 'x')) - _.min(_.map(points, 'x'));
  return (xWidth > SIZE / 5);
}

const blendAlphas = (a1, a2) => {
  return 1 - ((1 - a1) * (1 - a2));
}

function addFace (points, alpha) {
  let name = `face_${points.index}`;
  points.uvs.forEach((p) => p.x = shiftX(p.x));
  if (tooWide(points.uvs)) {
    return;
  }
  let existing = stage.getChildByName(name);
  if (existing) {
    existing.alpha = _.clamp(blendAlphas(existing.alpha, alpha), 0, 1);
  } else {
    let face = new Shape();
    face.name = name;
    face.alpha = alpha;
    let last = _.last(points.uvs);
    face.graphics.f('white').mt(last.x, last.y);
    points.uvs.forEach((pt) => face.graphics.lt(pt.x, pt.y));
    stage.addChild(face);
  }
}

function addSpot (centerUVs, borderUVs) {
  borderUVs.forEach((points) => addFace(points, 0.2));
  centerUVs.forEach((points) => addFace(points, 0.4));
  stage.update();
}

const scaleList = (uvSet) => uvSet.forEach((face) => face.uvs.forEach((point) => point.multiplyScalar(SIZE)))

export const paintAt = ({centerUVs, borderUVs}) => {
  if (!centerUVs.length) {
    return;
  }
  scaleList(centerUVs);
  scaleList(borderUVs);

  if (mouseDown) {
    addSpot(centerUVs, borderUVs);
  }
}

let mouseDown = false;
let mouse2Down = false;
export const setMouseDown = (isDown, is2Down) => {
  mouseDown = isDown;
  mouse2Down = is2Down;
}

export default canvas;