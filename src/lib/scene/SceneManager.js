import * as THREE from 'three';
import GeneralLights from './GeneralLights';
import bottle from '../bottle';

export default canvas => {

  const clock = new THREE.Clock();
  const origin = new THREE.Vector3(0, 0, 0);

  let cWidth = canvas.width;
  let cHeight = canvas.height;

  const screenDimensions = {
    width: cWidth,
    height: cHeight
  };

  const mousePosition = new THREE.Vector2(0, 0);
  const relativeMouse = new THREE.Vector2(0, 0);

  const scene = buildScene();
  const renderer = buildRender(screenDimensions);
  const camera = buildCamera(screenDimensions);
  const sceneSubject = createSceneSubject(scene);

  function buildScene() {
    return new THREE.Scene();
  }

  function buildRender({width, height}) {
    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
    const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    return renderer;
  }

  function buildCamera({width, height}) {
    const aspectRatio = width / height;
    const fieldOfView = 60;
    const nearPlane = 4;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    camera.position.z = 40;

    return camera;
  }

  function createSceneSubject(scene) {
    let sceneSubject = new bottle.container.SceneSubject(scene);
    sceneSubject.addLights(GeneralLights(scene));
    return sceneSubject;
  }

  const raycaster = new THREE.Raycaster();

  function update() {
    const elapsedTime = clock.getElapsedTime();
    sceneSubject.update(elapsedTime);

    updateCameraPositionRelativeToMouse();
    //
    raycaster.setFromCamera(mousePosition, camera);
    let inter = raycaster.intersectObjects([sceneSubject.worldMesh]);
    sceneSubject.intersect(inter);
    renderer.render(scene, camera);
  }

  function updateCameraPositionRelativeToMouse() {
    camera.position.x += (  (mousePosition.x * 0.01) - camera.position.x ) * 0.01;
    camera.position.y += ( -(mousePosition.y * 0.01) - camera.position.y ) * 0.01;
    camera.lookAt(origin);
  }

  function onWindowResize() {
    const {width, height} = canvas;
    cWidth = width;
    cHeight = height;

    screenDimensions.width = width;
    screenDimensions.height = height;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  function onMouseMove(x, y) {
    const {scrollWidth, scrollHeight} = canvas;
    mousePosition.x = x;
    mousePosition.y = y;
    relativeMouse.x = x / scrollWidth;
    relativeMouse.y = y / -scrollHeight;
  }

  function setMouseDown(m1, m2){
    sceneSubject.setMouseDown(m1, m2);
  }

  return {
    update,
    onWindowResize,
    onMouseMove,
    setMouseDown
  }
}