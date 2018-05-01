import * as THREE from 'three'

import _ from 'lodash';

export default (bottle) => {
  bottle.constant('windColorCold', () => new THREE.Color(0, 0.2, 0.5));
  bottle.constant('windColorMed', () => new THREE.Color(0, 0.5, 0.2));
  bottle.constant('windColorHot', () => new THREE.Color(1, 0.2, 0));
  bottle.constant('windColorTail', new THREE.Color(20, 0, 0));
  bottle.factory('windMeshGradImage', () => {
    return new THREE.TextureLoader().load('http://flatworld.studio:5000/static/images/toonShader.png');
  });
  bottle.factory('windMesh', (container) => (location, color) => {
    let mesh = new THREE.Mesh(container.windGeometry, new THREE.MeshToonMaterial({
      gradientMap: container.windMeshGradImage,
      color: color || container.windColorCold()
    }));
    mesh.position.copy(location);
    return mesh;
  });
  bottle.factory('spriteMap', () => {
    return new THREE.TextureLoader().load('http://flatworld.studio:5000/static/images/tail.png');
  });
  bottle.factory('spriteMaterial', (container) => new THREE.SpriteMaterial({map: container.spriteMap}));
  bottle.factory('tailMesh', (container) => (location) => {
    var sprite = new THREE.Sprite(container.spriteMaterial);
    sprite.position.copy(location);
    sprite.scale.set(.1, .1, 1);
    return sprite;
  });

  bottle.constant('ORIGIN', new THREE.Vector3(0, 0, 0));
  bottle.factory('windGeometry', (container) => new THREE.SphereGeometry(container.ISO_SIZE / 200, 12, 6))
  bottle.factory('tailGeometry', (container) => new THREE.SphereGeometry(container.ISO_SIZE / 300, 12, 6))
  bottle.factory('WindParticle', (container) => class WindParticle {
    constructor (location, manager) {
      this.mesh = container.windMesh(location, container.windColorCold());
      this.mesh.position.copy(location);
      this.tail = _.range(0, 10)
                   .map(() => container.tailMesh(location));
      this.tailMeshPQ = [];
      this.manager = manager;
      this.manager.scene.add(this.mesh);
      this.tail.forEach((tail) => this.manager.worldGroup.add(tail));
      do {
        this._momentum = new container.Vector3(0, 1, 0);
      } while (this._momentum.equals(container.ORIGIN));
      this._velocity = container.ISO_SIZE / 1500;
      this._momentum.setLength(this._velocity);
    }

    destroy () {
      this.manager.scene.remove(this.mesh);
    }

    anchor () {
      this._lastLocalPosition = this.local(this.mesh.position.clone());
    }

    local (pt) {
      return this.manager.worldGroup.worldToLocal(pt.clone());
    }

    world (pt) {
      return this.manager.worldGroup.localToWorld(pt.clone());
    }

    preserveMomentumLength (newPos, oldPos, length) {
      let vector = newPos.clone()
                         .sub(oldPos);
      vector.setLength(length);
      return oldPos.clone()
                   .add(vector);
    }

    keepWorldPointHeight (worldPt, height) {
      let local = this.local(worldPt);
      local.setLength(height);
      return this.world(local);
    }

    /**
     * moves a world point by a vector along the surface of the earth.
     * @param worldPoint
     * @param vector
     */
    push (worldPoint, vector) {
      let oldHeight = this.local(worldPoint)
                          .length();
      let vecLength = vector.length();
      let worldPointAfterPush = worldPoint.clone()
                                          .add(vector);

      worldPointAfterPush = this.keepWorldPointHeight(worldPointAfterPush, oldHeight);
      return this.preserveMomentumLength(worldPointAfterPush, worldPoint, vecLength);
    }

    TAIL_LENGTH = 30

    setTailPos () {
      let currentWorldPos = this._lastLocalPosition.clone();
      this.tailMeshPQ.push(currentWorldPos.clone());
      while (this.tailMeshPQ.length > (1 + this.tail.length) * this.TAIL_LENGTH) this.tailMeshPQ.shift();
      let last = _.last(this.tailMeshPQ);

      this.tail.forEach((tail, i) => {
        tail.position.copy(this.tailMeshPQ[(i + 1) * this.TAIL_LENGTH] || last);
      });
    }

    move () {
      if (this._lastLocalPosition) {
        this.setTailPos();
        let currentWorldPos = this.mesh.position.clone();
        let anchoredWorldPos = this.world(this._lastLocalPosition);
        let currentRotationalMomentum = anchoredWorldPos.clone()
                                                        .sub(currentWorldPos);
        let anchoredWorldPosAfterMom = this.push(currentWorldPos, this._momentum.clone()
                                                                      .add(currentRotationalMomentum));
        let worldPosAfterMomentum = this.push(currentWorldPos, this._momentum); // ignores earths spin.
        this._momentum = worldPosAfterMomentum.clone()
                                              .sub(currentWorldPos);
        this._momentum.setLength(this._velocity);

        this.mesh.position.copy(anchoredWorldPosAfterMom);

        this._lastLocalPosition = this.local(this.mesh.position);
        this.mesh.updateMatrix();
      }
    }
  })
}