import style from './BottomNavigation.module.css';

export default () => {
  return <div className={style.BottomNavigation}>
    <div className={style.BottomNavigationActionCells}>
      <button className={style.NavButton}>Change Resolution</button>
      <button className={style.NavButton}>Save</button>
    </div>
  </div>;
}