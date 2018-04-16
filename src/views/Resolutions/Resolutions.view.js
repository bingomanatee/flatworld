import style from './Resolutions.module.css';

import res2 from './images/resolution-2@0.5x.png';
import res3 from './images/resolution-3@0.5x.png';
import res4 from './images/resolution-4@0.5x.png';
import res5 from './images/resolution-5@0.5x.png';

let images = [null, null, res2, res3, res4, res5];

const ResolutionChooser = (props) => (<div style={({backgroundImage: `url(${images[props.res]})`})}
                                           className={style['res-option'] + ' ' + style['res-option-unselected']}>
  <div className={style['res-option-darkener']}></div>
  <h2 className={style.Head}> {props.res - 1}</h2>
</div>);

const resolutions = [2,3,4,5];

export default () => (<div>
  <h2>Choose a Resolution</h2>
  <div className={style['resolution-list']}>
    {resolutions.map((res) => <ResolutionChooser key={`rc-${res}`} res={res}></ResolutionChooser>)}
  </div>
</div>)