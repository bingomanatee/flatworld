import * as THREE from 'three'

// import alphaTexture from './assets/textures/stripes_gradient.jpg';
import texCanvas, {paintAt, initWorld} from './sphereTexture';

const ISO_SIZE = 15;
const DEPTH = 5;
const ROT_SPEED = 0.3;

export default scene => {
  const group = new THREE.Group();

  const subjectGeometry = new THREE.IcosahedronGeometry(ISO_SIZE, DEPTH);
  const hexGeometry = new THREE.IcosahedronGeometry(ISO_SIZE, DEPTH);
  hexGeometry.computeFaceNormals();
  let hexGridSet = false;

  const texture = new THREE.Texture(texCanvas);
  const subjectMaterial = new THREE.MeshBasicMaterial({map: texture});

  const subjectMesh = new THREE.Mesh(subjectGeometry, subjectMaterial);

  hexGeometry.vertices.forEach((v) => v.multiplyScalar(1.1));
  const subjectWireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(hexGeometry, 0),
    new THREE.LineBasicMaterial({
      linewidth: 10,
      color: 'black'
    })
  );

  group.add(subjectMesh);
  //group.add(subjectWireframe);
  scene.add(group);
  group.rotation.z = Math.PI / 8;

  const speed = ROT_SPEED;

  function update (time) {
    const angle = time * speed;
    texture.needsUpdate = true;
    group.rotation.y = angle;
    group.updateMatrix();
    scene.remove(cursorMesh);
    if (!hexGridSet) {
      initWorld(subjectGeometry);
      hexGridSet = true;
    }
  }

  const cursorMat = new THREE.MeshBasicMaterial({color: new THREE.Color('rgb(0, 0, 255)')});
  const cursorGeometry = new THREE.SphereGeometry(
    0.5, 8, 8);
  const cursorMesh = new THREE.Mesh(cursorGeometry, cursorMat);

  let pointIndex = null;


  const findNearestVertex = (point) => {
    return _.flattenDeep(pointIndex.nearest(point, ISO_SIZE / 4)).shift();
  };

  function intersect (list) {

    if (list.length) {
      let p = list[0].point;
      cursorMesh.position.set(p.x, p.y, p.z);
      scene.add(cursorMesh);

      let localPoint = group.worldToLocal(p);
      if (vertexIndex) {
        paintAt(localPoint);
      }
    }
  }

  return {
    texture,
    update,
    subjectMesh,
    intersect
  }
}