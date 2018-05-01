import * as THREE from 'three'; // @TODO: bottle THREE

const ISO_SIZE = 15;
const DEPTH = 4;
const ROT_SPEEDS = [0, 0.05, 0.1, 0.2];
const AXIS_TILT =  23.5/ 360 * Math.PI * 2;

export default (bottle) => bottle.factory('SceneSubject', (container) => class SceneSubject {

  constructor(scene, resolution, elevation = []) {
    this.speed = 1;
    this.brushSize = 2;
    this.brushFlow = 2;
    this.brushRaised = true;
    this.elevation = elevation;
    this.initScene(scene);
    this.initWorld(resolution);
    this.initWind();
    this.initCursor();
  }

  initWind() {
    this.windGeometry = new THREE.SphereGeometry(ISO_SIZE / 300, 12, 6);
    this.windTexture = new THREE.MeshToonMaterial({
   //   gradientMap: 'http://flatworld.studio/static/toonShader.png',
      color: new THREE.Color(0,.2, .5)
    });
  }

  initScene(scene) {
    this.scene = scene;
    this.worldGroup = new THREE.Group();
    this.worldGroup.rotation.z = AXIS_TILT;
    this.scene.add(this.worldGroup);
  }

  initWorld(resolution) {
    this.resolution = resolution;
    this.worldGeometry = new THREE.IcosahedronGeometry(ISO_SIZE, resolution);
    this.textureManager = new container.CanvasTextureManager(resolution, this, this.elevation);
    this.textureManager.draw(true);
    this.worldTexture = new THREE.Texture(this.textureManager.canvas);
    const subjectMaterial = new THREE.MeshPhongMaterial({map: this.worldTexture,
      shininess: 10,
      specular: new THREE.Color(0,0,0).toString()});
    this.worldMesh = new THREE.Mesh(this.worldGeometry, subjectMaterial);
    this.worldGroup.add(this.worldMesh);
    this._wind = false;
  }

  addLights(lightGroup) {
    this.lightGroup = lightGroup;
  }


  // this is a removed object that shows the wireframe of the geometry.
  makeHexGeometry() {
    this.hexGeometry = new THREE.IcosahedronGeometry(ISO_SIZE, DEPTH);
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
    this.windParticles = [];
  }

  update(time) {
    let lastAngle =  this.worldGroup.rotation.y;
    let lastTime = this._lastTime || 0;
    let deltaTime = time - lastTime;
    this._lastTime = time;
    let deltaAngle = deltaTime * ROT_SPEEDS[this.speed];
    const angle = lastAngle + deltaAngle;

    if(this.wind) this.anchorWind();
    this.worldTexture.needsUpdate = this.textureManager.needsUpdate;
    this.textureManager.needsUpdate = false;
    this.worldGroup.rotation.y = angle;
    this.worldGroup.updateMatrix();
    if (this.wind) this.moveWind();
    //scene.remove(cursorMesh);
    //worldGroup.remove(nearMesh);
  }

  anchorWind() {
    for (let wind of this.windParticles) wind.anchor();
  //  console.log(this.windParticles[0].geometry.position.clone().round().toArray());
  }
  moveWind() {
    console.log('moving wind');
    for (let wind of this.windParticles) wind.move();
    console.log(this.worldGroup.worldToLocal(this.windParticles[0].geometry.position).clone().round().toArray());
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
    this.windParticles = [];
    for (let i = 0; i < this.worldGeometry.vertices.length; ++i) {
      let geometry = new THREE.Mesh(this.windGeometry, this.windTexture);
      let windParticle = new container.WindParticle(geometry, this.worldGroup.localToWorld(this.worldGeometry.vertices[i].clone().multiplyScalar(1.1)) , this);
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
    b = !!b;
    if (b !== this._wind) {
      console.log('wind set: ', b);
      b ? this.addWindParticles() : this.removeWindParticles();
      this._wind = b;
    }
  }

  setMouseDown(m1, m2) {
    this.textureManager.setMouseDown(m1, m2);
  }
})