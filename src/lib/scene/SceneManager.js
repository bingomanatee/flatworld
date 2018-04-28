import * as THREE from 'three';
import GeneralLights from './GeneralLights';
import _ from 'lodash';


export default (bottle) => {
  bottle.constant('origin', new bottle.container.Vector3(0, 0, 0));
  bottle.constant('DPR', window.devicePixelRatio ? window.devicePixelRatio : 1);
  bottle.factory('SceneManager', () => class SceneManager {
    constructor (canvas, resolution) {
      this.resolution = resolution;
      this.canvas = canvas;
      this.clock = new THREE.Clock();
      this.scene = new THREE.Scene();
      this.buildRender();
      this.buildCamera();
      this.createSceneSubject();

      this.mousePosition = new bottle.container.Vector2(0, 0);
      this.relativeMouse = new bottle.container.Vector2(0, 0);
      this.raycaster = new THREE.Raycaster();
    }

    get screenDimensions () {
      return _.pick(this.canvas, ['width', 'height']);
    }

    setSpeed (n) {
      this.sceneSubject.speed = n;
    }

    setBrushSize (n) {
      this.sceneSubject.brushSize = n;
    }

    setBrushFlow (n) {
      this.sceneSubject.brushFlow = n;
    }

    setBrushRaised (n) {
      this.sceneSubject.brushRaised = n;
    }

    createSceneSubject () {
      this.sceneSubject = new bottle.container.SceneSubject(this.scene, this.resolution);
      this.sceneSubject.addLights(GeneralLights(this.scene));
      return this.sceneSubject;
    }

    buildCamera () {
      const {width, height} = this.screenDimensions;
      const aspectRatio = width / height;
      const fieldOfView = 60;
      const nearPlane = 4;
      const farPlane = 100;
      this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
      this.camera.position.z = 40;

      return this.camera;
    }

    buildRender () {
      const {width, height} = this.screenDimensions;
      this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true, alpha: true});
      this.renderer.setPixelRatio(bottle.container.DPR);
      this.renderer.setSize(width, height);

      this.renderer.gammaInput = true;
      this.renderer.gammaOutput = true;

      return this.renderer;
    }

    update () {
      const elapsedTime = this.clock.getElapsedTime();
      this.sceneSubject.update(elapsedTime);

      this.updateCameraPositionRelativeToMouse();
      this.raycaster.setFromCamera(this.mousePosition, this.camera);
      let inter = this.raycaster.intersectObjects([this.sceneSubject.worldMesh]);
      this.sceneSubject.intersect(inter);
      this.renderer.render(this.scene, this.camera);
    }

    updateCameraPositionRelativeToMouse () {
      // this.camera.position.x += ((mousePosition.x * 0.01) - camera.position.x) * 0.01;
      // camera.position.y += (-(mousePosition.y * 0.01) - camera.position.y) * 0.01;
      this.camera.lookAt(bottle.container.origin);
    }

    onWindowResize () {
      const {width, height} = this.screenDimensions;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
    }

    onMouseMove (x, y) {
      const {scrollWidth, scrollHeight} = this.canvas;
      this.mousePosition.x = x;
      this.mousePosition.y = y;
      this.relativeMouse.x = x / scrollWidth;
      this.relativeMouse.y = y / -scrollHeight;
    }

    setMouseDown (m1, m2) {
      this.sceneSubject.setMouseDown(m1, m2);
    }
  });
}