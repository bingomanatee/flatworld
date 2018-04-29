import auth0 from 'auth0-js';
import _ from 'lodash'
export default (bottle, bottleConst) => {
  bottle.factory('auth0', (container) => {
    return new auth0.WebAuth(container.auth0config);
  });

  bottle.decorator('stateDef', (stateDef) => {
    const {StateConfig} = bottle.container;
    stateDef.addStateAndSetEffect('accessToken', null, StateConfig.TYPE_STRING);
  });

  bottle.factory('isLoggedIn',(container) => ({expiresAt}) => {
    return expiresAt && expiresAt > _.now();
  });

  bottle.const('auth0config', {
      domain: 'wonderlandabs.auth0.com',
      clientID: '1sZN86rYdFn4n9jfMp6VV8G6PLRJkQbe',
      redirectUri: 'http://flatworld.studio:5000/login',
      audience: `https://wonderlandabs.auth0.com/userinfo`,
      responseType: 'token id_token',
      scope: `openid profile`
    });
};