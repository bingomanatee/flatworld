import * as THREE from 'three'
// import alphaTexture from './assets/textures/stripes_gradient.jpg';
import texCanvas from './sphereTexture';

export default scene => {
  const group = new THREE.Group();

  const subjectGeometry = new THREE.IcosahedronGeometry(15, 5);
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
 // group.add(subjectWireframe);
  scene.add(group);

  group.rotation.z = Math.PI / 4;

  const speed = 0.1;

  function update (time) {
    const angle = time * speed;
    texture.needsUpdate = true;
    group.rotation.y = angle;
  }

  return {
    texture,
    update,
    subjectMesh
  }
}