import _ from "lodash";
import WorldTiler from './WorldTiler';
let worldBottle = WorldTiler();

export default (bottle) => {

  bottle.factory('CTMHex', (container) => class CTMHex {
    constructor (manager, hex, alpha = 0) {
      this.manager = manager;
      this.hex = hex;
      this.id = hex.id;
      this.center = worldBottle.container.arrayToVector3(hex.center);
      this.wedges = hex.uvs.map((shape) => shape.map(worldBottle.container.arrayToVector2));
      this._alpha = alpha;
      this._needsUpdate = true;
      this.calcBox();
    }

    get needsUpdate() {
      return this._needsUpdate;
    }

    set needsUpdate(val) {
      if (val) {
        this.manager.needsUpdate === true;
      }
      this._needsUpdate = true;
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
      this.alpha = newAlpha;
    }

    get alpha () {
      return this._alpha;
    }

    set alpha(alpha) {
      if (alpha !== this._alpha) {
        this._alpha = alpha;
        this.needsUpdate = true;
        this.manager.throttledDraw();
      }
    }

    draw () {
      let color = this.alpha ? worldBottle.container.globeGradient.rgbAt(this.alpha)
                                          .toRgbString() : container.TEXTURE_BG_COLOR;

      const ctx = this.manager.ctx;

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      let scalePt = new container.Vector2(this.manager.canvas.width/100, this.manager.canvas.height/100);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      for (let wedge of this.wedges) {
        let localWedge = wedge.map((pt) => pt.clone().multiply(scalePt));
        let last = _.last(localWedge);
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        for (let pt of localWedge) {
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

}