import {Component} from 'react';
import style from './SpeedButtons.module.css';
import {ButtonManager} from './ButtonManager';
import {injectState} from 'freactal';
import ReactSVG from 'react-svg';

const WIDTH = 210;
const HEIGHT = 318;

function SPFHeightOffset () {
  if (!window) {
    return 200;
  }
  return (window.innerHeight - HEIGHT) / 2;
}

export default injectState(class SpeedButtons extends Component {
  state = {
    loaded: false,
    buttons: null
  }

  svgToButtons (svg) {
   this.buttonSvg = svg;

    this.buttonManager = new ButtonManager(svg);
    this.buttonManager.onSpeedChanged = (speed) => {
      this.props.effects.setSpeed(speed);
    }
    this.addButton('slow_button_cw', 1);
    this.addButton('medium_button_cw', 2);
    this.addButton('fast_button_cw', 3);
    this.addPauseButton('pause_button_cw');
  }

  addButton (id, speed) {
    let button = this.buttonSvg.querySelector('#' + id);
    this.buttonManager.addButton(button, speed);
  }

  addPauseButton(id) {
    let button = this.buttonSvg.querySelector('#' + id);
    this.buttonManager.addPauseButton(button);
  }

  render () {
    return <div className={style.SpeedButtonFrame} style={({width: WIDTH, height: HEIGHT, top: SPFHeightOffset()})}>
      <ReactSVG
        path="/static/cw_controls.svg"
        callback={(svg) => this.svgToButtons(svg)}
        className="class-name"
        wrapperClassName="wrapper-class-name"
      />
    </div>
  }
});