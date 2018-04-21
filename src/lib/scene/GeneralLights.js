import * as THREE from 'three'

export default scene => {

  const warmLight = new THREE.PointLight("#300c47", 0.5);
  const backLight = new THREE.PointLight("#2196F3", 2);
  backLight.position.set(40,20,-40);
  warmLight.position.set(-30, -50, 400);
  const lightGroup = new THREE.Group();
  const direct = new THREE.DirectionalLight(
    new THREE.Color(200,225,100).toString(), 5);
  direct.position.set(-100, 30, 80);
  lightGroup.add(direct);
  lightGroup.add(warmLight);
  lightGroup.add(backLight);
  scene.add(lightGroup);

  return lightGroup;
}