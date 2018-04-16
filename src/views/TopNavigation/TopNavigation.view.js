import style from './TopNavigation.module.css';

export default () => {
  return <div className={style.TopNavigation}>
    <div className={style.TopNavigationHeadCell}>
    <h1 className={style.Head}>Flatworld</h1>
    </div>
    <div className={style.TopNavigationActionCells}>
      <button>Start Over</button>
      <button>About</button>
    </div>
  </div>;
}