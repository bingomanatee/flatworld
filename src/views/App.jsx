import style from './App.module.css';
import PageFrame from './PageFrame/PageFrame.view';
import { BrowserRouter } from 'react-router-dom';
import bottle from '../lib/state/state';

console.log('stateDef: ', bottle.container.stateDef.toHash());

export default bottle.container.wrapComponentWithState(({state}) => (
      <BrowserRouter>
      <div className={style.App}>
        <PageFrame />
      </div>
      </BrowserRouter>
    ));
