import {fabric} from 'fabric';
import {Component} from 'react';
import style from './SpeedButtons.module.css';
import {ButtonManager} from './ButtonManager';
import {injectState} from 'freactal';
import ReactSVG from 'react-svg';

const WIDTH = 210;
const HEIGHT = 318;

const BUTTON_ACTIVE_COLOR = '#588A21';
const BUTTON_INACTIVE_COLOR = '#293E11';

function SPFHeightOffset () {
  if (!window) {
    return 200;
  }
  return (window.innerHeight - HEIGHT) / 2;
}

//
// const buttonInjector = (domElement) => {
//
//   let buttonModel = new ButtonManager();
//   function registerObject(o){
//     if (!(o && o.id)) return;
//     buttonModel[o.id] = o;
//     console.log('registered ', o.id);
//   }
//
//   const canvas = createCanvas(document, domElement, WIDTH, HEIGHT);
//   var fabricCanvas = new fabric.Canvas(canvas, { preserveObjectStacking: true, selection: false, isDrawingMode: false});
//   fabricCanvas.renderAll();
//   buttonModel.canvas = fabricCanvas;
//
//   fabric.loadSVGFromURL('/static/cw_controls.svg',function(objects,options) {
//     var loadedObjects = fabric.util.groupSVGElements(objects, options);
//
//     loadedObjects.set({
//       width: WIDTH ,
//       height: HEIGHT,
//       selection: false
//     });
//
//     loadedObjects.on('mouse:over', () => console.log('mouse over on root'));
//
//     fabricCanvas.add(loadedObjects);
//     fabricCanvas.forEachObject((o) => {
//       console.log('root object: ', o);
//       buttonModel.registerObject(o);
//       o.set('selectable', false);
//       o.selectable = false;
//       o.forEachObject((o) => {
//         buttonModel.registerObject(o);
//       });
//     });
//     fabricCanvas.renderAll();
//     buttonModel.redraw();
//   });
//
//   return buttonModel;
// }

export default injectState(class SpeedButtons extends Component {
  state = {
    loaded: false,
    buttons: null
  }

  componentDidMount () {
    // setTimeout(() => requestAnimationFrame(() => {
    //   this.setState({loaded: true, buttons:  buttonInjector(this.canvasElement)})
    // }), 100);
  }

  svgToButtons (svg) {
    this.buttonManager = new ButtonManager();
    this.buttonManager.onSpeedChanged = (speed) => {
      this.props.effects.setSpeed(speed);
    }
    this.addButton('slow_button_cw', 1);
    this.addButton('medium_button_cw', 2);
    this.addButton('fast_button_cw', 3);
    this.addPauseButton('pause_button_cw');
  }

  addButton (id, speed) {
    let button = document.getElementById(id);
    this.buttonManager.addButton(button, speed);
  }

  addPauseButton(id) {
    let button = document.getElementById(id);
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