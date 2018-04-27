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
    setTimeout(() => requestAnimationFrame(() => {
      const worldState = bottle.container.worldSceneInjector(this.threeRootElement, this.props.state.resolution);
      this.terminateWorld = worldState.terminateWorld;
      this.manager = worldState.manager;
      this.setState({loaded: true})
    }), 500);
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

  componentDidUpdate() {
    console.log('state: ', this.props.state);
    this.manager.setSpeed(this.props.state.speed);
    this.manager.setBrushSize(this.props.state.brushSize);
    this.manager.setBrushFlow(this.props.state.brushFlow);
    this.manager.setBrushRaised(this.props.state.brushRaised);
  }

  componentWillUnmount () {
    if (this.terminateWorld) {
      this.terminateWorld();
    }
  }


});