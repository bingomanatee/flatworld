import * as THREE from 'three'; // @TODO: bottle THREE
import _ from 'lodash';

const ROT_SPEEDS = _.range(0, 2, 0.05);
const AXIS_TILT =  23.5/ 360 * Math.PI * 2;

export default (bottle) => {
  bottle.constant('ISO_SIZE', 15);
  bottle.factory('SceneSubject', (container) => class SceneSubject {

    constructor(scene, resolution, elevation = []) {
      this.resolution = resolution;
      this.speed = 1;
      this.brushSize = 2;
      this.brushFlow = 2;
      this.brushRaised = true;
      this.elevation = elevation;
      this.windParticles = [];
      this.initScene(scene);
      this.initWorld();
      this.initCursor();
    }

    initScene(scene) {
      this.scene = scene;
      this.worldGroup = new THREE.Group();
      this.worldGroup.rotation.z = AXIS_TILT;
      this.scene.add(this.worldGroup);
    }

    initWorld() {
      this.worldGeometry = new THREE.IcosahedronGeometry(container.ISO_SIZE, this.resolution);
      this.textureManager = new container.CanvasTextureManager(this.resolution, this, this.elevation);
      this.textureManager.draw(true);
      this.worldTexture = new THREE.Texture(this.textureManager.canvas);
      const subjectMaterial = new THREE.MeshPhongMaterial({map: this.worldTexture,
        shininess: 10,
        specular: new THREE.Color(0,0,0)});
      this.worldMesh = new THREE.Mesh(this.worldGeometry, subjectMaterial);
      this.worldGroup.add(this.worldMesh);
      this._wind = false;
    }

    addLights(lightGroup) {
      this.lightGroup = lightGroup;
    }


    // this is a removed object that shows the wireframe of the geometry.
    makeHexGeometry() {
      this.hexGeometry = new THREE.IcosahedronGeometry(container.ISO_SIZE, this.resolution);
      this.hexGeometry.computeFaceNormals();
      this.hexGeometry.vertices.forEach((v) => v.multiplyScalar(1.1));
      this.hexWireframe = new THREE.LineSegments(
        new THREE.EdgesGeometry(this.hexGeometry, 0),
        new THREE.LineBasicMaterial({
          linewidth: 10,
          color: 'black'
        })
      );
      this.worldGroup.add(this.hexWireframe);
    }

    update(time) {
      let lastAngle =  this.worldGroup.rotation.y;
      let lastTime = this._lastTime || 0;
      let deltaTime = time - lastTime;
      this._lastTime = time;
      let deltaAngle = deltaTime * ROT_SPEEDS[this.speed];
      const angle = lastAngle + deltaAngle;

      if(this.wind) this.moveWind();
      if(this.wind) this.anchorWind();
      this.worldTexture.needsUpdate = this.textureManager.needsUpdate;
      this.textureManager.needsUpdate = false;
      this.worldGroup.rotation.y = angle;
      this.worldGroup.updateMatrix();
      //scene.remove(cursorMesh);
      //worldGroup.remove(nearMesh);
    }

    anchorWind() {
      for (let wind of this.windParticles) wind.anchor();
      //  console.log(this.windParticles[0].geometry.position.clone().round().toArray());
    }
    moveWind() {
      for (let wind of this.windParticles) wind.move();
    }

    initCursor() {
      const cursorMat = new THREE.MeshBasicMaterial({color: new THREE.Color('rgb(0, 0, 255)')});
      const cursorGeometry = new THREE.SphereGeometry(
        0.125, 8, 8);
      this.cursorMesh = new THREE.Mesh(cursorGeometry, cursorMat);
    }

    initNearMesh() {
      // reflects the actual point the cursor is near
      // for debugging
      const nearMat = new THREE.MeshBasicMaterial({color: new THREE.Color('rgb(0, 255, 255)')});
      const nearGeometry = new THREE.SphereGeometry(
        0.6, 8, 8);
      this.nearMesh = new THREE.Mesh(nearGeometry, nearMat);
    }

    intersect(list) {
      if (list.length) {
        let p = list[0].point;
        this.cursorMesh.position.set(p.x, p.y, p.z);

        let localPoint = this.worldGroup.worldToLocal(p);
        if (localPoint) {
          if (!this.hasCursor) {
            this.scene.add(this.cursorMesh);
            this.hasCursor = true;
          }
          this.textureManager.paintAt(localPoint);
        } else {
          this.scene.remove(this.cursorMesh);
          this.hasCursor = false;
        }
      }
    }

    addWindParticles () {
      this.removeWindParticles();
      for (let i = 0; i < this.worldGeometry.vertices.length; ++i) {
        let windParticle = new container.WindParticle(this.worldGroup.localToWorld(this.worldGeometry.vertices[i].clone().multiplyScalar(1.01)) , this);
        this.windParticles.push(windParticle);
      }
    }

    removeWindParticles() {
      for (let particle of this.windParticles) {
        particle.destroy();
      }
      this.windParticles = [];
    }

    get wind () {
      return this._wind;
    }

    set wind(b) {
      if (b !== this._wind) {
        this._wind = b;
        this._doWind();
      }
    }

    _doWind() {
      this._doWind = _.debounce(() => {
       this._wind? this.addWindParticles() : this.removeWindParticles();
      }, 1200);
      this._doWind();
    }

    setMouseDown(m1, m2) {
      this.textureManager.setMouseDown(m1, m2);
    }
  })
}