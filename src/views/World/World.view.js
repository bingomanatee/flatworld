import {Component} from 'react';
import style from './World.module.css';
import bottle from '../../lib/bottle';
import Dialog from '../Dialog/Dialog.view';
import Overlay from '../Overlay/Overlay.view';
import SpeedButtons from '../SpeedButtons/SpeedButtons.view';
import BrushButtons from '../BrushButtons/BrushButtons.view';

export default bottle.container.injectState(class Content extends Component {
  state = {
    loaded: false
  }

  componentDidMount () {
    const {effects} = this.props;
    effects.windOff()
           .then(() => {
             setTimeout(() => requestAnimationFrame(() => {
               console.log('initializing world');
               const worldState = bottle.container.worldSceneInjector(this.threeRootElement, this.props.state.resolution, this.props.state.elevation);
               this.terminateWorld = worldState.terminateWorld;
               this.manager = worldState.manager;
               this.manager.textureManager.onDraw = _.throttle(() => {
                 if (this.manager.textureManager.hexElevations.length) {
                   effects.setElevation(this.manager.textureManager.hexElevations)
                 }
               }, 500);
               this.setState({loaded: true})
             }), 500);
           });
  }

  render () {
    return (<div>
      {this.state.loaded ? '' : <Dialog title="Creating world ... please wait"/>}
      <div ref={element => this.threeRootElement = element} className={style.threeCanvas}/>
      {!this.state.loaded ? '' : <Overlay z-index={-500}>
        <div className={style.SpeedButtonFrame}>
          <SpeedButtons/>
        </div>
        <div className={style.SpeedButtonFrame}>
          <BrushButtons/>
        </div>
      </Overlay>}
    </div>);
  }

  componentDidUpdate () {
    this.manager.setSpeed(this.props.state.speed);
    this.manager.setBrushSize(this.props.state.brushSize);
    this.manager.setBrushFlow(this.props.state.brushFlow);
    this.manager.setBrushRaised(this.props.state.brushRaised);
    console.log('setting wind to ', this.props.state.wind);
    this.manager.setWind(this.props.state.wind);
  }

  componentWillUnmount () {
    if (this.terminateWorld) {
      this.terminateWorld();
    }
  }


});