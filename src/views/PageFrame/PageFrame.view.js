import style from './PageFrame.module.css';
import TopNavigation from '../TopNavigation/TopNavigation.view';
import BottomNavigation from '../BottomNavigation/BottomNavigation.view';
import Content from '../Content/Content.view';

export default () => <section className={style.PageFrame}>
  <TopNavigation/>
  <Content className={style['content-frame']}/>
  <BottomNavigation/>
</section>;
