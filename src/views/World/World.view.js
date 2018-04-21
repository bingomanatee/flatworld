import {Component} from 'react';
import style from './World.module.css';
import bottle from '../../lib/bottle';
import Dialog from '../Dialog/Dialog.view';

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
      {this.state.loaded ? '' :   <Dialog title="Creating world ... please wait" />}
      <div ref={element => this.threeRootElement = element} className={style.threeCanvas}>
      </div>
    </div>);
  }

  componentWillUnmount () {
    if (this.terminateWorld) {
      this.terminateWorld();
    }
  }
});