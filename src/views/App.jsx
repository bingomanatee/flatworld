import style from './App.module.css';
import PageFrame from './PageFrame/PageFrame.view';
import Content from './Content/Content.view';
import { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'
export default class App extends Component {

  render () {
    return (
      <BrowserRouter>
      <div className={style.App}>
        <PageFrame />
      </div>
      </BrowserRouter>
    )
  }
}
