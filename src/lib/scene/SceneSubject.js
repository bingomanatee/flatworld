import * as THREE from 'three'
let kdt = require('kd-tree-javascript');

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

  const indexPoints = () => {
    let verts = subjectGeometry.vertices;
    verts.forEach((v, i) => v.__index = i);
    pointIndex = new kdt.kdTree(verts, (a, b) => {
      if (b.distanceToSquared) {
        return b.distanceToSquared(a);
      }

      if (a.distanceToSquared) {
        return a.distanceToSquared(b);
      }
      return a.distanceToSquared(b);
    }, ['x', 'y', 'z']);
  }

  const findNearestVertex = (point) => {
    if (!pointIndex) {
      indexPoints();
    }
    return _.first(_.first(pointIndex.nearest(point, ISO_SIZE / 4)));
  };

  function intersect (list) {

    if (list.length) {
      let p = list[0].point;
      cursorMesh.position.set(p.x, p.y, p.z);
      scene.add(cursorMesh);

      let localPoint = group.worldToLocal(p);
      let vertexIndex = findNearestVertex(localPoint);
      if (vertexIndex) {
        paintAt(vertexIndex);
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