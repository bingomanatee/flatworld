import style from './PageFrame.module.css';
import TopNavigation from '../TopNavigation/TopNavigation.view';
import BottomNavigation from '../BottomNavigation/BottomNavigation.view';
export default () => <section className={style.PageFrame}><TopNavigation></TopNavigation>

<BottomNavigation/>
</section>;
