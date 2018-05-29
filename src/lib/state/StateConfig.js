import SeedFactory from 'freactal-seed';
const Seed = SeedFactory();

export default (bottle) => {

  bottle.factory('StateConfig', () => Seed);
}