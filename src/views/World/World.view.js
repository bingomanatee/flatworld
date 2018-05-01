import {Component} from 'react';
import style from './World.module.css';
import bottle from '../../lib/bottle';
import Dialog from '../Dialog/Dialog.view';
import Overlay from '../Overlay/Overlay.view';
import SpeedButtons from '../SpeedButtons/SpeedButtons.view';
import BrushButtons from '../BrushButtons/BrushButtons.view';
import _ from 'lodash';

const f = (n) => new Number(n).toFixed(3);
class WindTable extends Component {
  render () {
    let {windParticles} = this.props;
    if (!windParticles) {
      windParticles = [];
    }
    return <table className={style.windTable}>
      <thead>
      <tr>
        <th>x</th>
        <th>y</th>
        <th>z</th>
      </tr>
      </thead>
      {<tbody>
      {windParticles.slice(0, 4)
                    .map((wp, i) => <tr key={`wind-particle-${i}`}>
                      <td>{f(wp.mesh.position.x)}</td>
                      <td>{f(wp.mesh.position.y)}</td>
                      <td>{f(wp.mesh.position.z)}</td>
                    </tr>)}
      </tbody>}
    </table>
  }

  componentWillUnmount () {
    clearInterval(this.poll);
  }

  componentDidMount () {
  /*  this.poll = setInterval(() => {
      this.forceUpdate();
    }, 100);*/
  }
}

export default bottle.container.injectState(class Content extends Component {
  state = {
    loaded: false,
    windParticles: []
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
              /* this.manager.onMove = (() => this.setState({
                 windParticles: _.get(this, 'manager.sceneSubject.windParticles')
               }));*/
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
      /*  <div className={style.TableFrame}>
          <WindTable windParticles={this.state.windParticles}/>
        </div> */
      </Overlay>}
    </div>);
  }

  componentDidUpdate () {
    if (this.manager) {
      this.manager.setSpeed(this.props.state.speed);
      this.manager.setBrushSize(this.props.state.brushSize);
      this.manager.setBrushFlow(this.props.state.brushFlow);
      this.manager.setBrushRaised(this.props.state.brushRaised);
      this.manager.setWind(this.props.state.wind);
    }
  }

  componentWillUnmount () {
    if (this.terminateWorld) {
      this.terminateWorld();
    }
  }


});