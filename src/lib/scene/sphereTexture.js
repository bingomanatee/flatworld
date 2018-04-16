import WorldTiler from './WorldTiler';

let bottle = WorldTiler();

import _ from 'lodash';

const canvas = document.createElement('canvas');
canvas.renderOnAddRemove = false;

const SIZE = 512 * 2;
const ALPHA = 0.15;
canvas.width = SIZE;
canvas.height = SIZE;
canvas.id = 'texture';
const stage = new bottle.container.fabric.Canvas(canvas, {
  backgroundColor: 'rgb(0,25,51)'
});

let hexGroup = new bottle.container.fabric.Group();
stage.add(hexGroup);

let hexGridShape = new bottle.container.fabric.Group();
stage.add(hexGridShape);

const throttledUpdateStage = _.throttle(() => {
  stage.requestRenderAll();
}, 50, {leading: true});

let world;

function paintHex (point, alpha) {
  let nearest = nearestPoint(point);
  if (nearest && nearest.paintHex(alpha, hexGridShape, SIZE)) {
    for (let neighbor of nearest.neighborRing) {
      neighbor.paintHex(alpha /2, hexGridShape, SIZE);
    }
    throttledUpdateStage();
  }
}

export const nearestPoint = (localPoint) => world.nearestPoint(localPoint, 4);

export const initWorld = (geometry) => {
  world = new bottle.container.World(geometry);
  world.init();
  drawHexLines();
  initHexShapes();
  hexGridShape.addWithUpdate(new bottle.container.fabric.Rect());
  hexGroup.addWithUpdate(new bottle.container.fabric.Rect());
  throttledUpdateStage();
};

const drawHexLines = () => {
  for (let point of world.points.values()) {
    point.drawHexFrame(hexGridShape, SIZE);
  }
}

const initHexShapes = () => {for (let point of world.points.values()) {
  point.paintHex(0, hexGroup, SIZE);
}};

const drawFaces = () => {
  for (let uvSet of world.faceUvs) {
    let points = [];
    let pts = uvSet.map((pt) => pt.clone()
                                  .multiplyScalar(SIZE));
    let last = _.last(pts);
    points.push('M', last.x, ',', last.y);
    for (let pt of pts) {
      points.push('L', pt.x, ',', pt.y)
    }
    let face = new bottle.container.fabric.Path(points.join(' '));
    face.set('stroke', 'red');
    face.set('fill', false);
    hexGridShape.add(face);
  }
}

function addSpot (vertex, alpha) {
  paintHex(vertex, alpha);
}

function removeSpot(vertex) {
  paintHex(vertex, -ALPHA/3);
}

let throttledPaintAt = _.throttle((vertex) => {
  if (mouseDown) {
    addSpot(vertex, mouse2Down ? ALPHA/2 : ALPHA);
  } else if (mouse2Down) {
    removeSpot(vertex);
  }
}, 25);

export const paintAt = (vertex) => {
  throttledPaintAt(vertex);
};

let mouseDown = false;
let mouse2Down = false;
export const setMouseDown = (isDown, is2Down) => {
  mouseDown = isDown;
  mouse2Down = is2Down;
};

stage.renderAll();
document.getElementById("root")
        .parentNode
        .appendChild(canvas);

export default canvas;