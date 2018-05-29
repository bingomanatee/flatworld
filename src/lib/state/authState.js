import auth0 from 'auth0-js';
import _ from 'lodash'

export default (bottle) => {
  bottle.factory('auth0', (container) => {
    return new auth0.WebAuth(container.auth0config);
  });

  bottle.decorator('stateDef', (stateDef) => {
    const {StateConfig, authResultData, update} = bottle.container;
    stateDef.addStringAndSetEffect('accessToken', null);
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
    stateDef.addIntAndSetEffect('expiresAt', 0);
    stateDef.addEffect('clearProfile', update({profile: null}));
    stateDef.addSideEffect('login', (effects) => effects.saveLoginLocation()
                                                        .then(() => auth0.authorize())); // sends us to auth0 website

    stateDef.addStringAndSetEffect('loginLocation', '/');
    stateDef.addObjectAndSetEffect('profile', null);
    const CLEAR_AUTH = {accessToken: null, idToken: null, profile: null, expiresAt: null};
    stateDef.addEffect('logout', update(CLEAR_AUTH));
    stateDef.addStateSideEffect('loadProfile', (effects, state) => {
      if (state.accessToken) {
        bottle.container.auth0.client.userInfo(state.accessToken, (err, profile) => {
          if (profile) {
            effects.setProfile(profile);
          }
          //@TODO: handle error, else
        });
      }
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

  bottle.factory('getLocation', () => (container) => container.location.pathname);

  bottle.factory('location', () => window.location);

  bottle.factory('authResultData', (container) => (authResult) => (
    {
      accessToken: authResult.accessToken,
      idToken: authResult.idToken,
      expiresAt: (authResult.expiresIn * 1000) + _.now()
    }
  ));

  bottle.factory('isLoggedIn', (container) => ({expiresAt}) => {
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