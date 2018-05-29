import axios from 'axios';

export default (bottle) => {
  bottle.decorator('stateDef', (stateDef) => {
    stateDef.addStringAndSetEffect('name', '');
    stateDef.addStringAndSetEffect('notes', '');
    stateDef.addIntAndSetEffect('resolution', 4);
    stateDef.addIntAndSetEffect('speed', 2);
    stateDef.addIntAndSetEffect('brushSize', 2);
    stateDef.addIntAndSetEffect('brushFlow', 2);
    stateDef.addBoolPropAndEffects('brushRaised', true);
    stateDef.addArrayPropAndSetEffects('elevation', [], bottle.container.StateConfig.TYPE_FLOAT);
    stateDef.addEffect('resetElevationSize', () => (state) => {
      if (state.elevation.length <= state.resolution) {
        return state;
      }
      return Object.assign({}, state, {elevation: []});
    });
    stateDef.addBoolPropAndEffects('wind', false);
    stateDef.addStringAndSetEffect('randomWord', '');
    stateDef.addEffect('getRandomWord', () => bottle.container.axios.get(bottle.container.SERVER_API + '/rando')
                                                    .then(({data}) => bottle.container.mergeIntoState({randomWord: data.word})));

    stateDef.addIntAndSetEffect('diameter', 12700); // Earth's diameter (km).
    stateDef.addIntAndSetEffect('tilt', 24);
    stateDef.addIntAndSetEffect('daysInYear', 365);
    stateDef.addIntAndSetEffect('climate', 15);
    stateDef.addIntAndSetEffect('day', 24);

    stateDef.addEffect('initWorld', () => bottle.container.update({
      name: '',
      notes: '',
      diameter: 12700,
      tilt: 24,
      daysInYear: 365,
      climate: 15,
      day: 24
    }));

    stateDef.addStateSideEffect((effects, state) => {
      if (bottle.container.isLoggedIn(state)) {
        axios.post(bottle.container.SERVER_API, {
          config: bottle.container.worldConfig(state),
          worldData: bottle.container.worldData(state)
        })
             .then(({data}) => {
               console.log('data from save: ', data);
             });
      }
    })
    return stateDef;
  });
}