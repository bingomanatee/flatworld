import style from './Resolutions.module.css';

import bottle from './../../lib/state/state';

import ResolutionChoice from './ResolutionChoice.view';
const resolutions = [2,3,4,5];

export default bottle.container.injectState(({history}) => (<div className={style.Resolutions}>
  <div className={style['resolution-list']}>
    {resolutions.map((res) => <ResolutionChoice key={`rc-${res}`} res={res}></ResolutionChoice>)}
  </div>
  <p className="info">

  </p>
</div>));