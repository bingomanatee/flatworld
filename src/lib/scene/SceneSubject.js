import * as THREE from 'three'
import Voronoi from 'voronoi';
let kdt = require('kd-tree-javascript');

// import alphaTexture from './assets/textures/stripes_gradient.jpg';
import texCanvas, {paintAt, hexGrid} from './sphereTexture';

const ISO_SIZE = 15;

class Node {
  constructor (index, nodeMap) {
    this.index = index;
    this.nodeList = nodeMap;
    this.linkedNodes = new Set();
  }

  link (segments) {
    let linkedPoints = _(segments).filter((seg) => _.includes(seg, this.index)).flattenDeep().difference([this.index]).value();

    linkedPoints.forEach((index) => this.linkTo(index));
  }

  linkTo (index) {
    this.linkedNodes.add(this.nodeList.get(index));
  }

  get linkedIndexes () {
    return _.map(Array.from(this.linkedNodes.values()), 'index');
  }

  ring () {
    let ring = [this.index];
    let lastNode = this;
    do {
      let li = lastNode.linkedIndexes;
      let nextIndex = _(li).difference(ring).first();
      if (!_.isUndefined(nextIndex)) {
        ring.push(nextIndex);
        lastNode = this.nodeList.get(nextIndex);
      } else {
        break;
      }
    } while (lastNode && lastNode.index !== this.index);
    return ring.reverse();
  }
}

const oi = (parents) => _.sortBy(parent).join(',');

function hexify (geometry) {
  var g = new THREE.Geometry();
  g.vertices.push.apply(g.vertices, geometry.vertices.map((p) => p.clone()));
  let midpointMap = new Map();
  const putToMidpointMap = (parents, index) => {
    let ordered = oi(parents);
    midpointMap.set(ordered, index);
  }

  const getFromMidpointMap = (parents) => {
    let key = oi(parents);
    if (midpointMap.has(key)) {
      return midpointMap.get(key);
    } else {
      return false;
    }
  }

  const makeMidPoint = (p1index, p2index) => {
    let p1 = g.vertices[p1index];
    let p2 = g.vertices[p2index];
    let point = p1.clone().lerp(p2, 0.5);
    let index = g.vertices.length;
    g.vertices.push(point);
    return index;
  }

  const findOrMakeMidpoint = (p1index, p2index) => {
    if (midpointMap.has(oi([p1index, p2index]))) {
      return getFromMidpointMap([p1index, p2index]);
    } else {
      return makeMidPoint(p1index, p2index);
    }
  }

  geometry.vertices.forEach((v, centerPointIndex) => {
    let faces = _(geometry.faces).filter((face) => ((face.a === centerPointIndex || face.b === centerPointIndex || face.c === centerPointIndex))).value();

    let outerSegments = _.reduce(faces, (segments, face) => {
      segments.push(_.difference([face.a, face.b, face.c], [centerPointIndex]));
      return segments;
    }, []);

    let indexes = _(outerSegments).flattenDeep().uniq().value();

    let m = new Map();
    indexes.forEach((index) => {
      m.set(index, new Node(index, m));
    });
    for (let node of m.values()) {
      node.link(outerSegments);
    }
    let ring = Array.from(m.values()).pop().ring();
    console.log('ring: ', ring.join(','));
    ring.forEach((pointIndex, index) => {
      let bpIndex = (index > 0) ? index - 1 : ring.length - 1;
      let prevPointIndex = ring[bpIndex];

      let bpMidIndex = findOrMakeMidpoint(centerPointIndex, bpIndex);
      let ppMidIndex = findOrMakeMidpoint(centerPointIndex, prevPointIndex);
      g.faces.push(new THREE.Face3(centerPointIndex, bpMidIndex, ppMidIndex));
      g.faces.push(new THREE.Face3(centerPointIndex, ppMidIndex, bpMidIndex));
    });
    v.multiplyScalar(2);
  });
  console.log('done with Rings');
  return g;
}

function smoothHexCenter (hex, base) {
  base.vertices.forEach((v, pointIndex) => {
    let surroundingCorners = _(hex.faces).filter((face) => _.includes([face.a, face.b, face.c], pointIndex)).map((face) => [face.a, face.b, face.c]).flattenDeep().uniq().difference([pointIndex]).value();
    let vInHex = hex.vertices[pointIndex];
    _('x,y,z'.split(',')).forEach((dim) => {
      vInHex[dim] = _.meanBy(surroundingCorners, (vIndex) => hex.vertices[vIndex][dim]);
    });
  });
}

function getRings (geometry) {
  const wideP = new THREE.Vector2(2, 1);
  const wider = (v) => v.clone().multiply(wideP);
  let map = [];
  geometry.faces.forEach((face, faceIndex) => {
    const vertexIndexes = [face.a, face.b, face.c];
    let faceUVs = geometry.faceVertexUvs[0][faceIndex];
    vertexIndexes.forEach((faceVertexIndex, faceVertexKey) => {
      map[faceVertexIndex] = wider(faceUVs[faceVertexKey]); // todo -- average?
      map[faceVertexIndex].__faceVertexIndex = faceVertexIndex;
    });
  });

  return new Voronoi().compute(map, {xl: 0, xr: 2, yt: 0, yb: 1});
}

export default scene => {
  const group = new THREE.Group();

  const subjectGeometry = new THREE.IcosahedronGeometry(ISO_SIZE, 4);
  const hexGeometry = new THREE.IcosahedronGeometry(ISO_SIZE, 4);
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
  group.add(subjectWireframe);
  scene.add(group);
  group.rotation.z = Math.PI / 8;

  const speed = 0.5;

  function update (time) {
    const angle = time * speed;
    texture.needsUpdate = true;
    group.rotation.y = angle;
    group.updateMatrix();
    scene.remove(cursorMesh);
    if (!hexGridSet) {
      hexGrid(getRings(subjectGeometry));
      hexGridSet = true;
    }
  }

  const cursorMat = new THREE.MeshBasicMaterial({color: new THREE.Color('rgb(0, 0, 255)')});
  const cursorGeometry = new THREE.SphereGeometry(
    0.5, 8, 8);
  const cursorMesh = new THREE.Mesh(cursorGeometry, cursorMat);

  const getBorderUVs = (index, faces, depth) => {
    let border = _.reduce(depth, (memo, count) => {
      return memo.concat(faces[count]);
    }, []);
    return border.map(getUVs);
  }

  const getUVs = (index) => ({
    uvs: subjectMesh.geometry.faceVertexUvs[0][index],
    index: index
  });

  function findNearestFaceUVs (mousePoint) {
    let pointIndexes = _(subjectMesh.geometry.vertices).map((point, index) => ({
      point, index
    })).orderBy((data) => -data.point.distanceToSquared(mousePoint)).slice(0, 3).map('index').value();

    let faces = _(subjectMesh.geometry.faces).reduce((memo, face, index) => {
      let count = _.intersection(pointIndexes, [face.a, face.b, face.c]).length;
      if (count > 0) {
        memo[count].push(index);
      }
      return memo;
    }, {
      1: [], 2: [], 3: []
    });

    if (faces[2].length) {
      let index = faces[3][0];
      let centerUVs = getBorderUVs(index, faces, [2, 3]);
      let borderUVs = getBorderUVs(index, faces, [1]);

      return {centerUVs, borderUVs};
    } else {
      return false;
    }
  }

  let pointIndex = null;

  const indexPoints = () => {
    subjectGeometry.vertices.forEach((v, i) => v.__index = i);
    pointIndex = new kdt.kdTree(subjectGeometry.vertices, (a, b) => {
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
    return _.flattenDeep(pointIndex.nearest(point, ISO_SIZE / 4)).shift();
  }

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