import style from './App.module.css';
import PageFrame from './PageFrame/PageFrame.view';
import { BrowserRouter } from 'react-router-dom';
import bottle from '../lib/bottle';

export default bottle.container.wrapComponentWithState(({state}) => (
      <BrowserRouter>
      <div className={style.App}>
        <PageFrame />
      </div>
      </BrowserRouter>
    ));
