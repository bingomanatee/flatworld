import WorldTiler from './WorldTiler';
import kdt from 'kd-tree-javascript';

let worldBottle = WorldTiler();

const ALPHA = 0.025;
const THROTTLE_PAINT = 200;
import _ from 'lodash';

export default (bottle) => {
  bottle.constant('WORLD_TEXTURE_SIZE', 512 * 4);

  bottle.constant('TEXTURE_BG_COLOR', 'rgb(0,25,51)');

  bottle.factory('CTMHex', (container) => class CTMHex {
    constructor (manager, hex) {
      this.manager = manager;
      this.hex = hex;
      this.id = hex.id;
      this.center = worldBottle.container.arrayToVector3(hex.center);
      this.wedges = hex.uvs.map((shape) => shape.map(worldBottle.container.arrayToVector2)
                                                .map((point) => point.multiplyScalar(container.WORLD_TEXTURE_SIZE / 100))
      );
      this.alpha = 0;
      this.needsUpdate = false;
      this.calcBox();
    }

    calcBox () {
      let points = _.flattenDeep(this.wedges);
      this.minX = this.maxX = points[0].x;
      this.minY = this.maxY = points[0].y;

      for (let point of points) {
        if (point.x < this.minX) {
          this.minX = point.x;
        } else if (point.x > this.maxX) {
          this.maxX = point.x;
        }

        if (point.y < this.minY) {
          this.minY = point.y;
        } else if (point.y > this.maxY) {
          this.maxY = point.y;
        }
      }
    }

    get x () {
      return this.center.x;
    }

    get y () {
      return this.center.y;
    }

    get z () {
      return this.center.z;
    }

    distanceToSquared (p) {
      return this.center.distanceToSquared(p);
    }

    paint (alpha) {
      let newAlpha = _.clamp(alpha + this.alpha, 0, 1);
      if (this.alpha === newAlpha) {
        return;
      }
      this.alpha = newAlpha;
      this.needsUpdate = true;
      this.manager.throttledDraw();
    }

    draw () {
      let color = this.alpha ? worldBottle.container.globeGradient.rgbAt(this.alpha)
                             .toRgbString() : container.TEXTURE_BG_COLOR;

      const ctx = this.manager.ctx;

      ctx.save();
      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      for (let wedge of this.wedges) {
        let last = _.last(wedge);
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        for (let pt of wedge) {
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }

    get neighbors () {
      return this.hex.neighbors.map((i) => this.manager.hexIndex.get(i));
    }
  });


  bottle.factory('CanvasTextureManager', (container) => class TextureManager {

    constructor (resolution, manager) {
      this.resolution = resolution;
      this.manager = manager;
      this.initStage();
      this.loadData();
      this.data = false;
      this.draw(true);
    }

    throttledPaintAt (vertex) {
      this.throttledPaintAt = _.throttle((vertex) => this.paintAt(vertex), THROTTLE_PAINT, {leading: true});
      this.paintAt(vertex);
    }

    indexNearPoints () {
      console.log('indexed');
      this._nearPointIndex = new kdt.kdTree(Array.from(this.hexes), (a, b) => {
        return b.distanceToSquared(a);
      }, ['x', 'y', 'z']);
    }

    getNearestHex (pt, range = 1) {
      let nearest = this._nearPointIndex.nearest(pt, range);
      return nearest
        .reduce((nearest, pair) => {
          if (!nearest.length) {
            return pair;
          }
          if (pair[1] < nearest[1]) {
            return pair;
          }
          return nearest;
        }, [])[0];
    }

    throttledDraw () {
      this.throttledDraw = _.throttle(() => {
        this.draw();
      }, 50, {leading: true});
      this.draw();
    }

    loadData () {
      bottle.container.axios.get(`http://localhost:7070/world_coords/recurse${this.resolution}.json`)
            .then(({data}) => {
              this.data = data;
              this.hexes = _.values(data.hexes)
                            .map((hex) => new container.CTMHex(this, hex));
              this.hexIndex = new Map();
              for (let hex of this.hexes) this.hexIndex.set(hex.id, hex);
              this.indexNearPoints();
              console.log('world data loaded: ', data);
            });

      let edgeImage = new Image();
      edgeImage.crossOrigin = "anonymous";

      edgeImage.src = `http://localhost:7070/world_coord_images/edge_${this.resolution}.png`;
      edgeImage.onload = () => {
        this.edgeImage = edgeImage;
        console.log('edgeimage loaded');
        this.draw(true);
      }
    }

    paintAt (vertex) {
      if (!this.data) {
        return;
      }
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
      this.ctx = this.canvas.getContext('2d');
      this.draw();
    }

    drawBackground (force) {
      this.ctx.fillStyle = container.TEXTURE_BG_COLOR;
      this.ctx.beginPath();
      if (force) {
        this.ctx.rect(0, 0, container.WORLD_TEXTURE_SIZE, container.WORLD_TEXTURE_SIZE);
      } else {
        this.ctx.rect(this.updateBox.minX, this.updateBox.minY, this.updateBox.width, this.updateBox.height);
      }
      this.ctx.closePath();
      this.ctx.fill();
    }

    pickUpdated () {
      this.updatedHexes = _.filter(this.hexes, 'needsUpdate');
    }

    calcUpdateBox () {
      this.updateBox = {
        minX: _(this.updatedHexes)
          .map('minX')
          .min() - 2,
        maxX: _(this.updatedHexes)
          .map('maxX')
          .max() + 2,
        minY: _(this.updatedHexes)
          .map('minY')
          .min() - 2,
        maxY: _(this.updatedHexes)
          .map('maxY')
          .max() + 2
      }
      this.updateBox.height = this.updateBox.maxY - this.updateBox.minY;
      this.updateBox.width = this.updateBox.maxX - this.updateBox.minX;
    }

    draw (force) {
      if (force) {
        this.drawBackground(force);
      } else {
        this.pickUpdated();
        if (!this.updatedHexes.length) {
          return;
        }
        this.calcUpdateBox();
      }
      this.drawHexes(force);
      this.drawEdges(force);
      if (!force) {
        for (let hex of this.updatedHexes) {
          hex.needsUpdate = false;
        }
      }
      this.needsUpdate = true;
    }

    drawHexes (force) {
      if (this.hexes) {
        for (let hex of force ? this.hexes : this.updatedHexes) {
          hex.draw();
        }
      }
    }

    drawEdges (force) {
      if (this.edgeImage) {
        this.ctx.save();
        if (!force) {
          this.ctx.rect(this.updateBox.minX, this.updateBox.minY, this.updateBox.width, this.updateBox.height);
          this.ctx.clip();
        }
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.drawImage(this.edgeImage,
          0, 0, this.edgeImage.width, this.edgeImage.height,
          0, 0, container.WORLD_TEXTURE_SIZE, container.WORLD_TEXTURE_SIZE);
        this.ctx.restore();
      }
    }

    addSpot (vertex, alpha) {
      let flow = alpha * this.manager.brushFlow * this.manager.brushFlow / 10;
      if (!this.manager.brushRaised) flow *= -1;
      console.log('adding spot with flow', flow);

      let hex = this.getNearestHex(vertex);
      switch (this.manager.brushSize) {
        case 1:
          hex.paint(flow);
          break;

        case 2:
          hex.paint(flow);
          for (let neighbor of hex.neighbors) {
            neighbor.paint(flow / 2);
          }
          break;

        case 3:
          let paintedIds = [hex.id];
          hex.paint(flow);
          for (let neighbor of hex.neighbors) {
            neighbor.paint(flow *3/5);
            paintedIds.push(neighbor.id);
          }

          for (let neighbor of hex.neighbors) {
            for (let subNeighbor of neighbor.neighbors) {
              if (!_.includes(paintedIds,  subNeighbor.id)) {
                subNeighbor.paint(flow * 2/5);
              }
            }
          }
          break;

        default:
          hex.paint(alpha);
      }
    }

    removeSpot (vertex) {
      let hex = this.getNearestHex(vertex);
      hex.paint(-ALPHA / 3);
    }

    setMouseDown (isDown, is2Down) {
      this.mouseDown = isDown;
      this.mouse2Down = is2Down;
    };
  });

}
