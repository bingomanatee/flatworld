import style from './TopNavigation.module.css';
import bottle from './../../lib/bottle';

export default bottle.container.withRouter(({history}) => {
  return <div className={style.TopNavigation}>
    <div className={style.TopNavigationHeadCell}>
    <h1 className={style.Head}>Flatworld</h1>
    </div>
    <div className={style.TopNavigationActionCells}>
      <button>About</button>
    </div>
  </div>;
})