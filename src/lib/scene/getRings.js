
function getRings(loresGeometry, hexGeometry) {
  return loresGeometry.vertices.map((v, centerPointIndex) => {
    let faces = _(hexGeometry.faces).filter((face) => ((face.a === centerPointIndex || face.b === centerPointIndex || face.c === centerPointIndex))).value();

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
    let faceKeys = 'a,b,c'.split(',');
    const vertexUVs = _.reduce( hexGeometry.faceVertexUvs[0], (map, uvsForFace, faceIndex) => {
      let face = hexGeometry.faces[faceIndex];

      uvsForFace.forEach((uv, faceVertexIndex) => {
        let faceKey = faceKeys[faceVertexIndex];
        let vertexIndex = face[faceKey];
        map.set(vertexIndex, uv);
      });

      return map;
    }, new Map);
    return ring.map((index) => vertexUVs.get(index));
  });
}