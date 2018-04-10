
import Bottle from 'bottlejs';
import WorldElement from './WorldElement';
import IsoFace from './IsoFace';
import FaceEdge from './FaceEdge';
import World from './World';
import Point from './Point';

export default () => {
  let bottle = new Bottle();
  WorldElement(bottle);
  World(bottle);
  IsoFace(bottle);
  Point(bottle);
  FaceEdge(bottle);

  return bottle;
}