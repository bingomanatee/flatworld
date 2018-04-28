export default (bottle) => {
  bottle.decorator('stateDef', (stateDef) => {
    stateDef.addStateAndSetEffect('resolution', 4, bottle.container.StateConfig.TYPE_INT);
    stateDef.addStateAndSetEffect('speed', 2, bottle.container.StateConfig.TYPE_INT);
    stateDef.addStateAndSetEffect('brushSize', 2, bottle.container.StateConfig.TYPE_INT);
    stateDef.addStateAndSetEffect('brushFlow', 2, bottle.container.StateConfig.TYPE_INT);
    stateDef.addStateAndBoolEffect('brushRaised', true);
    return stateDef;
  });
}