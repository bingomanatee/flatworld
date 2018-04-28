import scene from './../../lib/scene';
import { Component } from 'react';
import style from './Content.module.css';
import {Route} from 'react-router-dom';
import World from './../World/World.view';
import Home from './../Home/Home.view';
import SetResolution from './../SetResolution/SetResolution.view';
import Generator from './../Generator/Generator.view';

export default () => (<div className={style.Content}>
  <Route path="/" exact component={Home} />
  <Route path="/world" exact component={World} />
  <Route path="/set-resolution" exact component={SetResolution} />
  <Route path="/generate-world" exact component={Generator} />
    </div>);