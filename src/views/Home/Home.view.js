import style from './Home.module.css';
import Resolutions from './../Resolutions/Resolutions.view';
import bottle from './../../lib/bottle';
import MainButton from './../MainButton/MainButton.view';

export default bottle.container.withRouter(({history}) => (<div className={style.Home}>
  <h1 className={style.Head}>Welcome to Flatworld</h1>
  <p className={style.text}>Flatworld lets you paint a globe's topography. You can also edit the tiles in greater detail. </p>
  <div className="brace-box">
    <h2 className={style['Resolutions-Head']}>Choose a Resolution</h2>
    <Resolutions/>
    <MainButton onClick={() => history.push('/world')}>Create a World</MainButton>
  </div>
</div>));
