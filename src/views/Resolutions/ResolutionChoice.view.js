import style from './Resolutions.module.css';

import res2 from './images/resolution-2@0.5x.png';
import res3 from './images/resolution-3@0.5x.png';
import res4 from './images/resolution-4@0.5x.png';
import res5 from './images/resolution-5@0.5x.png';

let images = [null, null, res2, res3, res4, res5];
import bottle from './../../lib/bottle';

export default bottle.container.injectState(({state, effects, res}) => (<div style={({backgroundImage: `url(${images[res]})`})}
                                                                                        onClick={() => effects.setResolution(res)}
                                                                                        className={style['ResolutionChoice'] + ' ' + style['res-option-unselected']}>
  {res === state.resolution ? '' : <div className={style['ResolutionChoice-darkener']}></div>}
  <h2 className={style.ChooserHead}> {res - 1}</h2>
</div>));