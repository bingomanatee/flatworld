import domHelpers from 'dom-helpers';
import _ from 'lodash';
const BUTTON_ACTIVE_COLOR = 'rgb(88,138,33)';
const BUTTON_FOLLOW_COLOR = 'rgba(88,138,33,0.5)';
const BUTTON_INACTIVE_COLOR = 'rgba(41,62,17,0.5)';
const BUTTON_PAUSE_ACTIVE_COLOR = 'rgba(138,60,33)';
const BUTTON_PAUSE_INACTIVE_COLOR = 'rgba(70,26,10,0.5)';

class BMButton {

  constructor (manager, domObject, speed = 0) {
    this.manager = manager;
    this.speed = speed;
    this.domObject = domObject;

    this.active = false;
    this._follow = false;

    this.linkArrow();
    this.addMouseEvents();
    this.draw();
    this._draw = _.throttle(() => this.draw(), 200);
  }

  get follow () {
    return this._follow;
  }

  set follow (value) {
    if (value !== this._follow) {
      this._follow = value;
      this.draw();
    }
  }

  linkArrow() {
    let arrowId = this.domObject.id + '_arrow';
    this.arrow = document.getElementById(arrowId);
    let backId = this.domObject.id + '_group';
    this.back = document.getElementById(backId);
  }

  addMouseEvents() {
    this._mouse(this.domObject);
    this._mouse(this.arrow);
    this._click(this.back);
    this._click(this.domObject);
  }

  _click(node) {
    let button = this;
    domHelpers.on(node, 'mousedown', () => {
      console.log('mousedown: ', button.speed);
      button.manager.onSpeedChanged(button.speed);
    });
  }

  _mouse(node) {
    let button = this;
    domHelpers.on(node, 'mouseover', () => {
      button.active = true;
      this.manager.setFollow(this.speed);
      button._draw();
    });
    domHelpers.on(node, 'mouseout', () => {
      button.active = false;
      button._draw();
    });
  }

  draw () {
    this._color(this.back);
  }

  get activeColor() { return BUTTON_ACTIVE_COLOR; }
  get followColor() { return BUTTON_FOLLOW_COLOR; }
  get inactiveColor() { return BUTTON_INACTIVE_COLOR; }

  _color(domObject) {
    if (this.active) {
      domObject.attributes.fill.nodeValue = this.activeColor;
    } else if (this.follow) {
      domObject.attributes.fill.nodeValue = this.followColor;
    } else {
      domObject.attributes.fill.nodeValue = this.inactiveColor;
    }
  }
}

class PauseButton extends BMButton {
  constructor (manager, domObject) {
    super(manager, domObject, 0);
  }

  get activeColor() { return BUTTON_PAUSE_ACTIVE_COLOR; }
  get followColor() { return BUTTON_PAUSE_INACTIVE_COLOR; }
  get inactiveColor() { return BUTTON_PAUSE_INACTIVE_COLOR; }

  linkArrow() {
    let id1 = this.domObject.id + '_1';
    this.back1 = document.getElementById(id1);
    let id2 = this.domObject.id + '_2';
    this.back2 = document.getElementById(id2);
  }

  addMouseEvents() {
    this._mouse(this.domObject);
    this._click(this.domObject);
  }
  draw () {
    this._color(this.domObject);
  }
}
export class ButtonManager {

  constructor() {
    this.buttons = [];
  }

  addButton(svgObject, speed) {
    this.buttons.push(new BMButton(this, svgObject, speed));
  }

  addPauseButton(svgObject) {
    this.buttons.push(new PauseButton(this, svgObject));
  }

  setFollow(speed) {
    for (let button of this.buttons) {
      button.follow = (button.speed < speed);
    }
  }

}