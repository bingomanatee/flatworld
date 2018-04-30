import auth0 from 'auth0-js';
import _ from 'lodash'

export default (bottle) => {
  bottle.factory('auth0', (container) => {
    return new auth0.WebAuth(container.auth0config);
  });

  bottle.decorator('stateDef', (stateDef) => {
    const {StateConfig, authResultData, update} = bottle.container;
    stateDef.addStateAndSetEffect('accessToken', null, StateConfig.TYPE_STRING);
    stateDef.addInitializer('logoutIfNotLoggedIn', -1);
    stateDef.addEffect('logoutIfNotLoggedIn', (effects) => (state) => {
      if (!bottle.container.isLoggedIn(state)) {
        effects.logout();
      }
      return state;
    });
    stateDef.addEffect('setAuthSession', update((state, authResult) => {
       let data = authResultData(authResult);
       console.log('auth session setting:', data);
       return data;
    }));
    stateDef.addStateValue('expiresAt', 0, StateConfig.TYPE_INT);
    stateDef.addEffect('clearProfile', update({profile: null}));
    stateDef.addSideEffect('login', (effects) => effects.saveLoginLocation()
                                                        .then(() => auth0.authorize()));

    stateDef.addStateValue('loginLocation', '/', StateConfig.TYPE_STRING);
    stateDef.addStateAndSetEffect('profile', null, StateConfig.TYPE_OBJECT);
    const CLEAR_AUTH = {accessToken: null, idToken: null, profile: null, expiresAt: null};
    stateDef.addEffect('logout',  update(CLEAR_AUTH));
    stateDef.addEffect('loadProfile', (effects) => (state) => {
      if (state.accessToken) {
        bottle.container.auth0.client.userInfo(state.accessToken, (err, profile) => {
          if (profile) {
            effects.setProfile(profile);
          }
          //@TODO: handle error, else
        });
      }
      return state;
    });

    stateDef.addSideEffect('handleAuthentication', (effects) => new Promise((resolve, fail) => {
        bottle.container.auth0.parseHash(async (err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            await effects.setAuthSession(authResult);
            await effects.loadProfile();
            resolve();
          } else if (err) {
            fail(err);
            alert(`Error: ${err.error}. Check the console for further details.`);
          } else {
            console.log('noop on handleAuth: ', arguments);
            fail('noop');
          }
        });
      }));

    stateDef.addEffect('saveLoginLocation', update(() => {
      setTimeout(() => bottle.container.auth0.authorize(), 100);
      return {loginLocation: bottle.container.getLocation()};
    }));
    return stateDef;
  });

  bottle.factory('getLocation', () => () => location.pathname);

  bottle.factory('authResultData', (container) => (authResult) => (
    {
      accessToken: authResult.accessToken,
      idToken: authResult.idToken,
      expiresAt: (authResult.expiresIn * 1000) + _.now()
    }
  ));
  bottle.factory('isLoggedIn', (container) => ({expiresAt}) => {
    console.log('isLoggedIn: expiresAt = ', expiresAt);
    return expiresAt && expiresAt > _.now();
  });

  bottle.constant('auth0config', {
    domain: 'wonderlandabs.auth0.com',
    clientID: '1sZN86rYdFn4n9jfMp6VV8G6PLRJkQbe',
    redirectUri: 'http://flatworld.studio:5000/callback',
    audience: `https://wonderlandabs.auth0.com/userinfo`,
    responseType: 'token id_token',
    scope: `openid profile`
  });
}
;