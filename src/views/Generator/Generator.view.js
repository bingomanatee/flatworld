import style from './Generator.module.css';
import {Component} from 'react';
import bottle from '../../lib/bottle';

console.log('bottle: ', bottle);

export default bottle.container.injectState(class Generator extends Component {
  state = {loaded: false, generator: false}

  componentDidMount () {
    this.props.effects.getRandomWord()
        .then(() => {
          const generator = new bottle.container.Generator(this.canvasElement,
            this.props.state.resolution,
            this.props.state.randomWord);
          this.setState({
            loaded: true,
            generator
          });
        });
  }

  render () {
    return <div className={style.Generator}>
      <h2 className={style.Head}>Generate World</h2>
      <p className={style.text}>Create a world form pre-generated simplex noise:</p>
      <div ref={element => this.canvasElement = element} className={style['Generator-canvas']}/>
    </div>;
  }
});