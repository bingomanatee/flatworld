import * as THREE from 'three'
// import alphaTexture from './assets/textures/stripes_gradient.jpg';
import texCanvas, {paintAt} from './sphereTexture';

const ISO_SIZE = 15;
export default scene => {
  const group = new THREE.Group();

  const subjectGeometry = new THREE.IcosahedronGeometry(ISO_SIZE, 5);
  const texture = new THREE.Texture(texCanvas);
  const subjectMaterial = new THREE.MeshBasicMaterial({map: texture});

  const subjectMesh = new THREE.Mesh(subjectGeometry, subjectMaterial);

  const subjectWireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(subjectGeometry),
    new THREE.LineBasicMaterial({
      linewidth: 10
    })
  );

  group.add(subjectMesh);
  group.add(subjectWireframe);
  scene.add(group);
  group.rotation.z = Math.PI / 8;

  const speed = 0.5;

  function update (time) {
    const angle = time * speed;
    texture.needsUpdate = true;
    group.rotation.y = angle;
    scene.remove(cursorMesh);
  }


  const cursorMat = new THREE.MeshBasicMaterial({color: new THREE.Color('rgb(0, 0, 255)')});
  const cursorGeometry = new THREE.SphereGeometry(
    2,
    8,
    8);
  const cursorMesh = new THREE.Mesh(cursorGeometry, cursorMat);

  function intersect(list) {
      if (list.length) {
      //  console.log('subject intersecting', list);
        let p  = list[0].point;
        cursorMesh.position.set(p.x, p.y, p.z);
        scene.add(cursorMesh);

        let localPoint = group.worldToLocal(p);
          localPoint.normalize();
          let acos = Math.acos(localPoint.x);
          let asin = Math.asin(localPoint.y);
          if (localPoint.z < 0) acos = Math.PI * 2 - acos;
        console.clear();
          console.log('local point: ', localPoint.multiplyScalar(100).round().toArray());
          paintAt(acos, asin);
      }
  }

  return {
    texture,
    update,
    subjectMesh,
    intersect
  }
}