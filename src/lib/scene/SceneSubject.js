import * as THREE from 'three'; // @TODO: bottle THREE

const ISO_SIZE = 15;
const DEPTH = 4;
const ROT_SPEED = 0.025;
const AXIS_TILT = Math.PI / 8;

export default (bottle) => bottle.factory('SceneSubject', (container) => class SceneSubject {

  constructor(scene) {
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
    this.worldGeometry = new THREE.IcosahedronGeometry(ISO_SIZE, DEPTH);
    this.textureManager = new container.TextureManager(this.worldGeometry);
    this.worldTexture = new THREE.Texture(this.textureManager.canvas);
    const subjectMaterial = new THREE.MeshBasicMaterial({map: this.worldTexture});
    this.worldMesh = new THREE.Mesh(this.worldGeometry, subjectMaterial);
    this.worldGroup.add(this.worldMesh);
  }

  addLights(lightGroup) {
    this.lightGroup = lightGroup;
  }

  /**
   * note - this is an unfollowed through beginning of creting hex geometry.
   */
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
  }

  update(time) {
    const angle = time * ROT_SPEED;
    this.worldTexture.needsUpdate = true; // TODO: sync with texture update
    this.worldGroup.rotation.y = angle;
    this.worldGroup.updateMatrix();
    //scene.remove(cursorMesh);
    //worldGroup.remove(nearMesh);
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

  setMouseDown(m1, m2) {
    this.textureManager.setMouseDown(m1, m2);
  }
})