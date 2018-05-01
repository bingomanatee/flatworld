export default (bottle) => {
  bottle.decorator('stateDef', (stateDef) => {
    stateDef.addStateAndSetEffect('resolution', 4, bottle.container.StateConfig.TYPE_INT);
    stateDef.addStateAndSetEffect('speed', 2, bottle.container.StateConfig.TYPE_INT);
    stateDef.addStateAndSetEffect('brushSize', 2, bottle.container.StateConfig.TYPE_INT);
    stateDef.addStateAndSetEffect('brushFlow', 2, bottle.container.StateConfig.TYPE_INT);
    stateDef.addStateAndBoolEffect('brushRaised', true);
    stateDef.addArrayAndSetEffect('elevation', [], bottle.container.StateConfig.TYPE_FLOAT);
    stateDef.addEffect('resetElevationSize', () => (state) => {
      if (state.elevation.length<= state.resolution) return state;
      return Object.assign({}, state, {elevation: []});
    });
    stateDef.addStateAndBoolEffect('wind', false);
    stateDef.addStateValue('randomWord', '', bottle.container.StateConfig.TYPE_STRING);
    stateDef.addEffect('getRandomWord', () => bottle.container.axios.get(bottle.container.SERVER_API + '/rando')
                                                    .then(({data}) => bottle.container.mergeIntoState({randomWord: data.word})));
    return stateDef;
  });
}