export default (bottle) => {
  bottle.decorator('stateDef', (stateDef) => {
    stateDef.addStateAndSetEffect('resolution', 4);
    stateDef.addStateAndSetEffect('speed', 2);
    stateDef.addStateAndSetEffect('brushSize', 2);
    stateDef.addStateAndSetEffect('brushFlow', 2);
    stateDef.addStateAndBoolEffect('brushRaised', true);
    return stateDef;
  });
}