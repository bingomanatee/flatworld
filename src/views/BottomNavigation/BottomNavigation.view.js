import style from './BottomNavigation.module.css';
import bottle from '../../lib/bottle';

export default bottle.container.injectState(bottle.container.withRouter(({history, effects}) => {
  return <div className={style.BottomNavigation}>
    <div className={style.BottomNavigationActionCells}>
      <button className={style.NavButton} onClick={() => history.push('/set-resolution')}>Change Resolution</button>
      <button className={style.NavButton} onClick={() => history.push('/generate-world')}>Generate</button>
      <button className={style.NavButton} onClick={() => history.push('/configure')}>Configure</button>
      <button className={style.NavButton} onClick={() => {
        effects.setElevation([]);

        history.push('/')}}>Start Over</button>
      <button className={style.NavButton}>Save</button>
    </div>
  </div>;
}));