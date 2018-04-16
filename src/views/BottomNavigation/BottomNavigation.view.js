import style from './BottomNavigation.module.css';

export default () => {
  return <div className={style.BottomNavigation}>
    <div className={style.BottomNavigationActionCells}>
      <button>Change Resolution</button>
      <button>Save</button>
    </div>
  </div>;
}