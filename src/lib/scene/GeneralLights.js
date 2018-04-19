import * as THREE from 'three'

export default scene => {

  const lightIn = new THREE.PointLight("#4CAF50", 30);
  const lightOut = new THREE.PointLight("#2196F3", 10);
  lightOut.position.set(40,20,40);
  const lightGroup = new THREE.Group();

  lightGroup.add(lightIn);
  lightGroup.add(lightOut);
  scene.add(lightGroup);

  return lightGroup;
}