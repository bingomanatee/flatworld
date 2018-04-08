import * as THREE from 'three'
// import alphaTexture from './assets/textures/stripes_gradient.jpg';
import texCanvas, {paintAt} from './sphereTexture';

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
    return ring;
  }
}

function hexify (geometry) {
  var g = new THREE.Geometry();

  geometry.vertices.forEach((v, index) => {
    let faces = _(geometry.faces).filter((face) => ((face.a === index || face.b === index || face.c === index))).value();

    let outerSegments = _.reduce(faces, (segments, face) => {
      segments.push(_.difference([face.a, face.b, face.c], [index]));
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
    console.log('ring: ', Array.from(m.values()).pop().ring());
  });
  return g;
}

export default scene => {
  const group = new THREE.Group();

  const subjectGeometry = new THREE.IcosahedronGeometry(ISO_SIZE, 5);
  const hexGeometry = hexify(subjectGeometry);
  const texture = new THREE.Texture(texCanvas);
  const subjectMaterial = new THREE.MeshBasicMaterial({map: texture});

  const subjectMesh = new THREE.Mesh(subjectGeometry, subjectMaterial);

  const subjectWireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(hexGeometry, 0.5),
    new THREE.LineBasicMaterial({
      linewidth: 10
    })
  );

  group.add(subjectMesh);
  group.add(subjectWireframe);
  scene.add(group);
  group.rotation.z = Math.PI / 8;

  const speed = 0.125;

  function update (time) {
    const angle = time * speed;
    texture.needsUpdate = true;
    group.rotation.y = angle;
    scene.remove(cursorMesh);
  }


  const cursorMat = new THREE.MeshBasicMaterial({color: new THREE.Color('rgb(0, 0, 255)')});
  const cursorGeometry = new THREE.SphereGeometry(
    2, 8, 8);
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

  function intersect (list) {
    if (list.length) {
      let p = list[0].point;
      cursorMesh.position.set(p.x, p.y, p.z);
      scene.add(cursorMesh);

      let localPoint = group.worldToLocal(p);
      let faceData = findNearestFaceUVs(localPoint);
      if (faceData) {
        paintAt(faceData);
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