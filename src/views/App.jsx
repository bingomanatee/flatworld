import { Component } from 'react'
import style from './App.module.css'
import scene from './../lib/scene';
import PageFrame from './PageFrame/PageFrame.view';

export default class App extends Component {
  state = {
    name: 'flatworld'
  };
  componentDidMount() {
    scene(this.threeRootElement);
  }

  render () {
    return (
      <div className={style.App}>
        <div ref={element => this.threeRootElement = element} className={style.threeCanvas} />
        <PageFrame />
      </div>
    )
  }
}
