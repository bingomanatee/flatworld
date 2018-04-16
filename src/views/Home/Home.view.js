import style from './Home.module.css';
import Resolutions from './../Resolutions/Resolutions.view';

export default () => (<div className={style.Home}>
  <h1 className={style.Head}>Welcome to Flatworld</h1>
  <p className={style.text}>Flatworld lets you paint a globe's topography. You can also edit the tiles in greater detail. </p>
  <Resolutions/>
</div>)
