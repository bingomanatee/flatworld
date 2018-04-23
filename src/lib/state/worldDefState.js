export default (bottle) => {
  bottle.decorator('stateDef', (stateDef) => {
    stateDef.addStateAndSetEffect('resolution', 4);
    stateDef.addStateAndSetEffect('speed', 2);
    return stateDef;
  });
}