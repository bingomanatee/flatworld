import {Component} from 'react';
import style from './BrushButtons.module.css';
import {BrushButtonManager} from './BrushButtonManager';
import {injectState} from 'freactal';
import ReactSVG from 'react-svg';

const WIDTH = 58;
const HEIGHT = 444;

function SPFHeightOffset () {
  if (!window) {
    return 200;
  }
  return (window.innerHeight - HEIGHT) / 2;
}

export default injectState(class BrushButtons extends Component {
  state = {
    loaded: false,
    buttons: null
  }

  svgToButtons (svg) {
    this.buttonSvg = svg;
    this.buttonManager = new BrushButtonManager(this.props.state.brushSize, this.props.state.brushFlow, this.props.state.brushRaised);
    let bbComponent = this;

    this.buttonManager.onSizeChanged = (size) => {
      bbComponent.props.effects.setBrushSize(size);
    }
    this.buttonManager.onFlowChanged = (flow) => {
      bbComponent.props.effects.setBrushFlow(flow);
    }

    this.buttonManager.onRaisedChanged = (raised) => {
      bbComponent.props.effects.setBrushRaised(raised);
    }

    this.addButton('sm_brush', 1);
    this.addButton('med_brush', 2);
    this.addButton('large_brush', 3);

    this.addFlowButton('flow_fast', 3);
    this.addFlowButton('flow_med', 2);
    this.addFlowButton('flow_slow', 1);

    this.addRaisedButton('raise', true);
    this.addRaisedButton('lower', false);
  }

  addButton (id, size) {
    let button = this.buttonSvg.querySelector('#' + id);
    let buttonActive = this.buttonSvg.querySelector('#' + id + '_active');
    this.buttonManager.addButton(button, buttonActive, size);
  }

  addFlowButton (id, flow) {
    let button = this.buttonSvg.querySelector('#' + id);
    let buttonActive = this.buttonSvg.querySelector('#' + id + '_active');
    this.buttonManager.addFlowButton(button, buttonActive, flow);
  }

  addRaisedButton(id, raised) {
    let button = this.buttonSvg.querySelector('#' + id);
    let buttonActive = this.buttonSvg.querySelector('#' + id + '_active');
    this.buttonManager.addRaisedButton(button, buttonActive, raised);
  }

  render () {
    return <div className={style.BrushButtonFrame} style={({width: WIDTH, height: HEIGHT, top: SPFHeightOffset()})}>
      <ReactSVG
        path="/static/brush_size.svg"
        callback={(svg) => this.svgToButtons(svg)}
        className="class-name"
        wrapperClassName="wrapper-class-name"
      />
    </div>
  }
});