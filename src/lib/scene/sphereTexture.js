import {createjs} from "@createjs/easeljs";
import Ticker from './Ticker';
console.log('createjs: ', createjs, 'ticker', Ticker);
const {Stage, Shape} = createjs;
//eval('debugger ');
import _ from 'lodash';

const canvas = document.createElement('canvas');
document.getElementById("root").parentNode.appendChild(canvas);
const SIZE = 1024;
canvas.width = SIZE;
canvas.height = SIZE;
canvas.id = 'texture';
const stage = new Stage(canvas);
const bg = new Shape();
bg.graphics.beginFill('white').drawRect(0, 0, SIZE, SIZE).endFill();
stage.addChild(bg);
stage.update();

Ticker.addEventListener("tick",
  event => {
    let x = _.random(0, SIZE);
    let y = _.random(SIZE/4, SIZE * 3/4);

    let shape = new Shape();
    shape.graphics.beginFill(Math.random() > 0.5 ? 'red' : 'white').drawCircle(x, y, _.random(0, SIZE/40));
    stage.addChild(shape);
    stage.update();
  }
);

export default canvas;