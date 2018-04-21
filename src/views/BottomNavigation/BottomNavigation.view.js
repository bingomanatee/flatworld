import style from './BottomNavigation.module.css';
import bottle from '../../lib/bottle';
export default bottle.container.injectState(bottle.container.withRouter(({history, events}) => {
  return <div className={style.BottomNavigation}>
    <div className={style.BottomNavigationActionCells}>
      <button className={style.NavButton} onClick={() => history.push('/set-resolution')}>Change Resolution</button>
      <button onClick={() => {
        console.log('starting over');
        history.push('/')
      }}>Start Over</button>
      <button className={style.NavButton}>Save</button>
    </div>
  </div>;
}));