import scene from './../../lib/scene';
import { Component } from 'react';
import style from './Content.module.css';
import {Route} from 'react-router-dom';
import World from './../World/World.view';
import Home from './../Home/Home.view';

export default () => (<div className={style.Content}>
  <Route path="/" exact component={Home} />
  <Route path="/world" exact component={World} />
    </div>);