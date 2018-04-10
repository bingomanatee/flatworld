/**
 * a utility class to arrange faces in order around shared edges
 */

export default (bottle) => bottle.factory('FaceEdge', (container) => class FaceEdge extends container.WorldElement {
  constructor(indexA, indexB, world) {
    super(world);
    this.orderedIndexes = FaceEdge.order(indexA, indexB);
    this.edgePoints = new Set(this.orderedIndexes.map(index => this.points.get(index)));
    this.id = FaceEdge.faceEdgeKey(this.orderedIndexes);
    this.world.edges.set(this.id, this);
  }

  static order(indexA, indexB) {
    if (Array.isArray(indexA)) {
      [indexA, indexB] = indexA;
    }
    return [indexA, indexB].sort((a, b) => b - a);
  }

  static faceEdgeKey(indexA, indexB) {
    return FaceEdge.order(indexA, indexB).join(' to ')
  }

  static findOrMakeEdge(indexA, indexB, world) {
    const id = FaceEdge.faceEdgeKey(indexA, indexB);
    if (world.edges.has(id)) {
      return world.edges.get(id);
    }
    const edge = new FaceEdge(indexA, indexB, world);
    world.edges.set(id, edge);
    return edge;
  }
});