import {createjs} from "@createjs/easeljs";
import Ticker from './Ticker';
console.log('createjs: ', createjs, 'ticker', Ticker);
const {Stage, Shape, Text} = createjs;
//eval('debugger ');
import _ from 'lodash';
const canvas = document.createElement('canvas');
document.getElementById("root").parentNode.appendChild(canvas);
const SIZE = 1024;
const LINE_WIDTH = 8;
canvas.width = SIZE;
canvas.height = SIZE;
canvas.id = 'texture';
const stage = new Stage(canvas);

const makeLatText = (stage, angle, color) => {
  let t = new Text('Lat ' + angle, '20px Arial', color);
  let x = SIZE * angle / 360;
  t.x = LINE_WIDTH + x;
  t.y = SIZE / 2 - LINE_WIDTH;
  stage.addChild(t);
  let stripe = new Shape();
  stripe.graphics.beginFill(color).drawRect(x, 0, LINE_WIDTH, SIZE);
  stage.addChild(stripe);
}

const bg = new Shape();
bg.graphics.beginFill('rgba(255,255,255,0.5)').drawRect(0, 0, SIZE, SIZE).endFill(); // background fill
stage.addChild(bg);
makeLatText(stage, 0, 'black');
makeLatText(stage, 90, 'red');
makeLatText(stage, 180, 'rgb(150,0,0)');
makeLatText(stage, 270, 'rgb(75,0,0)');
stage.update();

Ticker.addEventListener("tick",
  event => {
    let x = _.random(0, SIZE);
    let y = _.random(SIZE / 4, SIZE * 3 / 4);

    let shape = new Shape();
    shape.graphics.beginFill(Math.random() > 0.5 ? 'rgba(255,0,0,0.5)' : 'rgba(255,255,255,0.5)').drawCircle(x, y, _.random(0, SIZE / 40));
    stage.addChild(shape);
    stage.update();
  }
);

export default canvas;
let lineShape = new Shape();
lineShape.graphics.beginFill('black').drawRect(0, -SIZE/4, 2, SIZE /2 ).endFill()
.beginFill('green').drawRect(-SIZE/8, 0, SIZE/4, 2);
stage.addChild(lineShape);

export const paintAt = (acosX, asinY) => {
  let offset =  (2 - acosX / (Math.PI * 2)) * SIZE;
  offset = offset % SIZE;
  let yOffset = SIZE/2 - asinY/Math.PI * SIZE;
  console.log('offset:', asinY);

  lineShape.x = offset;
  lineShape.y = yOffset;
}