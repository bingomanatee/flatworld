import style from './Generator.module.css';
import {Component} from 'react';
import bottle from '../../lib/bottle';
import {Button, FontIcon} from 'react-md';

console.log('bottle: ', bottle);

const ZOOMS = [0.25, 0.33, 0.5, 0.66, 0.75, 1, 1.25, 1.33, 1.5, 1.66, 1.75, 1.5, 2, 2.25, 2.5, 2.75, 3];

export default bottle.container.injectState(class Generator extends Component {
  state = {loaded: false, generator: false, zoom: 4};

  componentDidMount () {
    this.props.effects.getRandomWord()
        .then(() => {
          const generator = new bottle.container.Generator(this.canvasElement,
            this.props.state.resolution,
            ZOOMS[this.state.zoom],
            this.props.state.randomWord);
          this.setState({
            loaded: true,
            generator
          });
        });
  }

  zoomOut () {
    if (this.state.zoom > 0) {
      this.setState({zoom: this.state.zoom - 1})
    }
  }

  zoomIn () {
    if (this.state.zoom < ZOOMS.length) {
      this.setState({zoom: this.state.zoom + 1});
    }
  }

  render () {
    return <div className={style.Generator}>
      <h2 className={style.Head}>Generate World</h2>
      <p className={style.text}>Create a world form pre-generated simplex noise:</p>
      <div className={style['Generator-canvas-wrapper']}>
        <div className={style['info']}>
          <p className={style['info-text']}>Seed: "{this.props.state.randomWord}"</p>
          <div>
            <Button raised primary onClick={() => this.zoomOut()} iconChildren="navigate_before">in</Button>
            <Button raised primary onClick={() => this.zoomIn()} iconBefore={false}
                    iconChildren="navigate_next">out</Button>
          </div>
        </div>
        <div ref={element => this.canvasElement = element} className={style['Generator-canvas']}/>
      </div>
    </div>;
  }

  componentDidUpdate () {
    if (this.state.generator) {
      this.state.generator.zoom = ZOOMS[this.state.zoom];
    }
  }

  componentWillUnmount () {
    let elevation = this.state.generator.hexElevations;
    this.props.effects.setElevation(elevation);
  }
});