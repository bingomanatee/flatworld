export default (bottle) => bottle.factory('WindParticle', () => class WindParticle {
  constructor (geometry, location, manager) {
    this.geometry = geometry;
    geometry.position.copy(location);
    this.manager = manager;
    this.manager.scene.add(this.geometry);
  }

  destroy () {
    this.manager.scene.remove(this.geometry);
  }

  anchor () {
    this._relativePos = this.manager.worldGroup.worldToLocal(this.geometry.position.clone());
  }
  move(){

    this.geometry.position.copy(this.manager.worldGroup.localToWorld(this._relativePos));
    this.geometry.updateMatrix();
  }
})