import WorldTiler from './WorldTiler';

let worldBottle = WorldTiler();
/**
 * Deprecated; the world class is now computed/cached on the server
 */

const ALPHA = 0.15;
const THROTTLE_PAINT = 100;
import _ from 'lodash';
/*
    const drawFaces = () => {
      for (let uvSet of world.faceUvs) {
        let points = [];
        let pts = uvSet.map((pt) => pt.clone()
          .multiplyScalar(container.WORLD_TEXTURE_SIZE));
        let last = _.last(pts);
        points.push('M', last.x, ',', last.y);
        for (let pt of pts) {
          points.push('L', pt.x, ',', pt.y)
        }
        let face = new worldBottle.container.fabric.Path(points.join(' '));
        face.set('stroke', 'red');
        face.set('fill', false);
        hexGridShape.add(face);
      }
    }
 */
export default (bottle) => {
  bottle.constant('WORLD_TEXTURE_SIZE', 512 * 2);

  bottle.factory('TextureManager', (container) => class TextureManager {

    constructor (geometry) {
      this.initStage();
      this.initWorld(geometry);

      this.throttledPaintAt = _.throttle((vertex) => this.paintAt(vertex), THROTTLE_PAINT);
      this.throttledDraw();
    }

    paintAt (vertex) {
      if (this.mouseDown) {
        this.addSpot(vertex, this.mouse2Down ? ALPHA / 2 : ALPHA);
      } else if (this.mouse2Down) {
        this.removeSpot(vertex);
      }
    }

    initStage () {
      this.canvas = document.createElement('canvas');
      this.canvas.width = container.WORLD_TEXTURE_SIZE;
      this.canvas.height = container.WORLD_TEXTURE_SIZE;
      this.stage = new worldBottle.container.fabric.Canvas(this.canvas, {
        backgroundColor: 'rgb(0,25,51)'
      });
      this.hexGroup = new worldBottle.container.fabric.Group();
      this.stage.add(this.hexGroup);

      this.hexGridShape = new worldBottle.container.fabric.Group();
      this.stage.add(this.hexGridShape);
      this.throttledDraw = _.throttle(() => {
        this.stage.requestRenderAll();
      }, 50, {leading: true});
    }

    drawHexLines () {
      for (let point of this.world.points.values()) {
        point.drawHexFrame(this.hexGridShape, container.WORLD_TEXTURE_SIZE);
      }
    }

    initHexShapes () {
      for (let point of this.world.points.values()) {
        point.paintHex(0, this.hexGroup, container.WORLD_TEXTURE_SIZE);
      }
    }

    initWorld (geometry) {
      this.world = new worldBottle.container.World(geometry);
      this.world.init();
      this.drawHexLines();
      this.initHexShapes();
      this.hexGridShape.addWithUpdate(new worldBottle.container.fabric.Rect());
      this.hexGroup.addWithUpdate(new worldBottle.container.fabric.Rect());
      this.throttledDraw();
    }

    addSpot (vertex, alpha) {
      this.world.paintHex(vertex, alpha, this.hexGridShape, container.WORLD_TEXTURE_SIZE);
      this.throttledDraw();
    }

    removeSpot (vertex) {
      this.world.paintHex(vertex, -ALPHA / 3, this.hexGridShape, container.WORLD_TEXTURE_SIZE);
      this.throttledDraw();
    }

    setMouseDown (isDown, is2Down) {
      this.mouseDown = isDown;
      this.mouse2Down = is2Down;
    };
  });

}
