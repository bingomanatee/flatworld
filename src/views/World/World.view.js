import scene from './../../lib/scene';
import { Component } from 'react';
import style from './World.module.css';

export default class Content extends Component {
  componentDidMount() {
    scene(this.threeRootElement);
  }

  render () {
    return (<div ref={element => this.threeRootElement = element} className={style.threeCanvas}/>);
  }
}