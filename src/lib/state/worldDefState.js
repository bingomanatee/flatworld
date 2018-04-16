export default (bottle) => {
  bottle.decorator('stateDef', (stateDef) => {
    stateDef.addStateAndSetEffect('resolution', 4);
    return stateDef;
  });
}