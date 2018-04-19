import { Component } from 'react';
import style from './World.module.css';
import bottle from '../../lib/bottle';

export default class Content extends Component {
  componentDidMount() {
    bottle.container.worldSceneInjector(this.threeRootElement);
  }

  render () {
    return (<div ref={element => this.threeRootElement = element} className={style.threeCanvas}/>);
  }
}