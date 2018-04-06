import * as THREE from 'three';
import SceneSubject from './SceneSubject';
import GeneralLights from './GeneralLights';

export default canvas => {

  const clock = new THREE.Clock();
  const origin = new THREE.Vector3(0,0,0);

  let mesh;

  let cWidth = canvas.width;
  let cHeight = canvas.height;

  const screenDimensions = {
    width: cWidth,
    height: cHeight
  }

  const mousePosition = new THREE.Vector2(0,0);
  const relativeMouse = new THREE.Vector2(0, 0);

  const scene = buildScene();
  const renderer = buildRender(screenDimensions);
  const camera = buildCamera(screenDimensions);
  const sceneSubjects = createSceneSubjects(scene);

  function buildScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#FFF");

    return scene;
  }

  function buildRender({ width, height }) {
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    return renderer;
  }

  function buildCamera({ width, height }) {
    const aspectRatio = width / height;
    const fieldOfView = 60;
    const nearPlane = 4;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

    camera.position.z = 40;

    return camera;
  }

  function createSceneSubjects(scene) {
    let subjects = SceneSubject(scene);
    const {update, intersect, subjectMesh} = subjects;
    mesh = subjectMesh;

    const sceneSubjects = [
       GeneralLights(scene),
      {update, intersect}
    ];

    return sceneSubjects;
  }
  const raycaster = new THREE.Raycaster();

  function update() {
    const elapsedTime = clock.getElapsedTime();

    for(let i=0; i<sceneSubjects.length; i++)
      sceneSubjects[i].update(elapsedTime);

    updateCameraPositionRelativeToMouse();
   // console.log('relativeMouse: ',Math.round(relativeMouse.x * 100), Math.round(relativeMouse.y * 100));
    raycaster.setFromCamera( relativeMouse, camera );
    let inter = raycaster.intersectObjects( [mesh] );
    if (inter.length)
    for(let i=0; i<sceneSubjects.length; i++)
      if(sceneSubjects[i].intersect)
          sceneSubjects[i].intersect(inter);

    // calculate objects intersecting the picking ray var intersects =
    renderer.render(scene, camera);
  }

  function updateCameraPositionRelativeToMouse() {
    camera.position.x += (  (mousePosition.x * 0.01) - camera.position.x ) * 0.01;
    camera.position.y += ( -(mousePosition.y * 0.01) - camera.position.y ) * 0.01;
    camera.lookAt(origin);
  }

  function onWindowResize() {
    const { width, height } = canvas;
    cWidth = width;
    cHeight = height;
    screenDimensions.width = width;
    screenDimensions.height = height;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  function onMouseMove(x, y) {
    console.log('mouse move: ', x, y);
    mousePosition.x = x;
    mousePosition.y = y;
    relativeMouse.x = x / cWidth;
    relativeMouse.y = y / cHeight;
  }

  return {
    update,
    onWindowResize,
    onMouseMove
  }
}