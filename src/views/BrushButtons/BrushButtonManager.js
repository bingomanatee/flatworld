import domHelpers from 'dom-helpers';

class BMButton {

  constructor (manager, domObject, domActiveObject, speed = 0) {
    this.manager = manager;
    this.speed = speed;
    this.domObject = domObject;
    this.domActiveObject = domActiveObject;

    this.active = false;
    this.addMouseEvents();
  }

  get active () {
    return this._active;
  }

  set active (value) {
    this._active = value;
    this.domObject.style.opactity = value ? 0 : 1;
    this.domActiveObject.style.opacity = value ? 1 : 0;
  }

  addMouseEvents () {
    this._click(this.domObject);
    this._click(this.domActiveObject);
  }

  _click (node) {
    domHelpers.on(node, 'mousedown', () => {
      if (!this.active) {
        this.manager.setActive(this.speed);
      }
    });
  }
}

class BMFlowButton {

  constructor (manager, domObject, domActiveObject, flow = 0) {
    this.manager = manager;
    this.flow = flow;
    this.domObject = domObject;
    this.domActiveObject = domActiveObject;

    this.active = false;
    this.addMouseEvents();
  }

  get active () {
    return this._active;
  }

  set active (value) {
    this._active = value;
    this.domObject.style.opactity = value ? 0 : 1;
    this.domActiveObject.style.opacity = value ? 1 : 0;
  }

  addMouseEvents () {
    this._click(this.domObject);
    this._click(this.domActiveObject);
  }

  _click (node) {
    domHelpers.on(node, 'mousedown', () => {
      if (!this.active) {
        this.manager.setActiveFlow(this.flow);
      }
    });
  }
}

class BMRaisedButton {

  constructor (manager, domObject, domActiveObject, raised = false) {
    this.manager = manager;
    this.raised = raised;
    this.domObject = domObject;
    this.domActiveObject = domActiveObject;

    this.active = false;
    this.addMouseEvents();
  }

  get active () {
    return this._active;
  }

  set active (value) {
    this._active = value;
    this.domObject.style.opactity = value ? 0 : 1;
    this.domActiveObject.style.opacity = value ? 1 : 0;
  }

  addMouseEvents () {
    this._click(this.domObject);
    this._click(this.domActiveObject);
  }

  _click (node) {
    domHelpers.on(node, 'mousedown', () => {
      if (!this.active) {
        this.manager.setActiveRaised(this.raised);
      }
    });
  }
}

export class BrushButtonManager {
  constructor (size, flow, raised) {
    this.buttons = [];
    this.flowButtons = [];
    this.size = size;
    this.flow = flow;
    this.raised = raised;
    this.raisedButtons = [];
  }

  addButton (svgObject, activeObject, size) {
    this.buttons.push(new BMButton(this, svgObject, activeObject, size));
    this.setActive(this.size);
  }

  addFlowButton (svgObject, activeObject, flow) {
    this.flowButtons.push(new BMFlowButton(this, svgObject, activeObject, flow));
    this.setActiveFlow(this.flow);
  }

  addRaisedButton (svgObject, activeObject, raised) {
    this.raisedButtons.push(new BMRaisedButton(this, svgObject, activeObject, raised));
    this.setActiveRaised(this.raised);
  }

  setActive (size) {
    this.size = size;
    for (let button of this.buttons) {
      button.active = (button.speed === size);
    }
    this.onSizeChanged(size);
  }

  setActiveFlow (flow) {
    this.flow = flow;
    for (let button of this.flowButtons) {
      button.active = (button.flow === flow);
    }
    this.onFlowChanged(flow);
  }

  setActiveRaised (raised) {
    this.raised = raised;
    for (let button of this.raisedButtons) {
      button.active = (button.raised === raised);
    }
    this.onRaisedChanged(raised);
  }
}