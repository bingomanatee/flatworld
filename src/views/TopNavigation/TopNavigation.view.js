import style from './TopNavigation.module.css';
import bottle from './../../lib/bottle';

export default bottle.container.injectStateAndRouter(({history, state, effects}) => {

  let user;
  if (bottle.container.isLoggedIn(state)) {
    user =  state.profile ? <div>
      <span className={style.navInfo}> Logged in as {state.profile.name}</span>
      <button onClick={() => effects.logout()} className={style.NavButton}>Log Out</button>
    </div> : <div>loading...</div>;
  } else {
    user = <button onClick={() => effects.login()} className={style.NavButton}>Log In</button>
  }

  return <div className={style.TopNavigation}>
    <div className={style.TopNavigationHeadCell}>
      <h1 className={style.Head}>Flatworld</h1>
    </div>
    <div className={style.TopNavigationActionCells}>
      <button className={style.NavButton}>About</button>
      {user}
    </div>
  </div>;
})