import style from './Generator.module.css';
import {Component} from 'react';
import bottle from '../../lib/bottle';

export default class Generator extends Component {
  state = {loaded: false, generator: false}

  componentDidMount () {
    setTimeout(() => requestAnimationFrame(() => {
      this.setState({
        loaded: true,
      //  generator: new bottle.container.Generator(this.canvasElement, this.props.state.resolution)
    })
    }), 500);
  }

  render () {
    return <div className={style.Generator}>
      <h2 className={style.Head}>Generate World</h2>
      <p className={style.text}>Create a world form pre-generated simplex noise:</p>
      <div ref={element => this.canvasElement = element} className={style.generatorCanvas}/>
    </div>;
  }
}