import style from './Stats.module.css';
import _ from 'lodash';
import bottle from './../../lib/bottle';
import {
  Card, CardTitle, CardText, Button, TextField, SelectField,
  Slider,
} from 'react-md';

const Indicator = ({children}) => <span className="md-slider-ind">{children}</span>;

const EARTHS_DIAM = 12700;
const WORLD_SIZES = [
  {
    value: 3500,
    label: 'VERY SMALL - Moon size (3.5k diameter, 25% Earth)'
  },
  {
    value: 7000,
    label: 'SMALL - Mars size(7k diameter, 50% Earth)'
  },
  {
    value: 10000,
    label: 'SLIGHTLY SMALLER - (10k diameter, 75% Earth)'
  },
  {
    value: EARTHS_DIAM,
    label: 'NORMAL (12.7k diameter, Earth size)'
  },
  {
    value: 16000,
    label: 'SLIGHTLY LARGER - (16k diameter, 125% Earth)'
  },
  {
    value: 19000,
    label: 'LARGE - (19k diameter, 150% Earth)'
  },
  {
    value: 25000,
    label: 'HUGE - (25k diameter, 200% Earth)'
  },
  {
    value: 60000,
    label: 'GIGANTIC (60k diameter, 500% Earth)'
  },
  {
    value: 125000,
    label: 'TITANIC (125k diameter, 10x Earth)'
  }
];

function diameterToValue (diameter) {
  if (!diameter) {
    return WORLD_SIZES[3];
  }
  return _(WORLD_SIZES)
    .sortBy((size) => Math.abs(size.value - diameter))
    .first();
}

const TRACK_HEIGHT = 10

export default bottle.container.injectState(({
                                               state: {
                                                 diameter,
                                                 tilt,
                                                 daysInYear,
                                                 climate,
                                                 day,
                                               },
                                               effects: {
                                                 setDiameter,
                                                 setDaysInYear,
                                                 setTilt,
                                                 setClimate,
                                                 setDay,
                                               }
                                             }) => {
  const configDiameter = diameterToValue(diameter).value;
  console.log('configDiameter = ', configDiameter);

  const hoursInYear = daysInYear * 24;
  const localDaysInYear = Math.round(hoursInYear/day);

  const circ = Math.PI * diameter;
  const eqSpeed = Math.round(circ/day);

  const daimRatio = diameter/EARTHS_DIAM;
  let maxDay = Math.max(50, 100 * daimRatio);
  maxDay = _.round(maxDay, -1);
  
  const surfaceArea = radius => 4 * Math.PI * radius * radius;
  const surface = surfaceArea(diameter/2);
  
  const surfaceOfEarth = surfaceArea(EARTHS_DIAM/2);

  const percent = n => Math.round(n * 100) + '%';

  return (<div className={style.Stats}>
    <h2 className={style.Head}>World Properties</h2>
    <div className={style['stats-grid']}>
      <Card className={style['md-card']}>
        <CardTitle title="Planet Diameter" className={style['card-head']}/>
        <CardText>
          <p>The diameter of the planet. For practical reasons the planet's
            size is in the same order of magnitude as the earths (from 25% to 5000%)</p>
          <SelectField
            id="select-field-1"
            title="Diameter"
            placeholder="Relative size of planet's diameter"
            position={SelectField.Positions.BELOW}
            menuItems={WORLD_SIZES}
            simplifiedMenu={false}
            value={configDiameter}
            itemValue="value"
            itemLabel="label"
            fullWidth={true}
            onChange={(diameter) => {
              console.log('diameter set to: ', diameter);
              setDiameter(diameter)
            }}
          />
        </CardText>
      </Card>
      <Card className={style['md-card']}>
        <CardTitle title={"Planetary Tilt"} className={style['card-head']}/>
        <CardText>
          <p>24 degrees is normal for Earth. The greater the tilt,
            <br/>the more extreme
            the seasons will be. zero tilt == no seasons!</p>
          <Slider
            id="tilt"
            min={0}
            max={48}
            step={4}
            valuePrecision={0}
            discrete
            discreteTicks={8}
            value={tilt}
            editable
            onChange={setTilt}
            discrete
            leftIcon={<Indicator>Tilt</Indicator>}
            style={({margin: 10})}
          />
        </CardText>
      </Card>
      <Card className={style['md-card']}>
        <CardTitle title={"Length of Year"} className={style['card-head']}/>
        <CardText>
          <p>Length of the Year. Governed by the speed of the planet around its sun.
            <br/>A longer year gives a longer winter...</p>
          <Slider
            id="tilt"
            min={100}
            max={1000}
            step={5}
            valuePrecision={0}
            discrete
            discreteTicks={8}
            value={daysInYear}
            editable
            onChange={setDaysInYear}
            discrete
            leftIcon={<Indicator>Days/year</Indicator>}
            style={({margin: 10})}
          />
        </CardText>
      </Card>
      <Card className={style['md-card']}>
        <CardTitle title={"Length of Day"} className={style['card-head']}/>
        <CardText>
          <p>Length of the day, in earth hours.
            <br/>The length of the Day interacts with the size of the planet
            to determine equatorial speed. Earth's speed is 1,000 miles an hour
            <br/>The higher the equatorial speed, the the Coriolis effect (curving of wind away from the poles).</p>
          <Slider
            id="tilt"
            min={2}
            max={maxDay}
            step={2}
            valuePrecision={0}
            discrete
            discreteTicks={10}
            value={day}
            editable
            onChange={setDay}
            discrete
            leftIcon={<Indicator>Hours in a day</Indicator>}
            style={({margin: 10})}
          />
        </CardText>
      </Card>
      <Card className={style['md-card']}>
        <CardTitle title={"Climate"} className={style['card-head']}>
        </CardTitle>
        <CardText>
          <p>The median strength of the solar heat compared to Earth.
            <br/>Though we are providing a zany set of options for fun's sake,
            anything outside 5-25&deg; is going to be difficult to live on.
            <br/>The Earth climate is 14.6&deg; Celsius. </p>
          <Slider
            id="tilt"
            min={-10}
            max={80}
            step={2}
            valuePrecision={0}
            discrete
            discreteTicks={10}
            value={climate}
            editable
            onChange={setClimate}
            discrete
            leftIcon={<Indicator>&deg;Celsius</Indicator>}
            style={({margin: 10})}
          />
        </CardText>
      </Card>
    </div>
    <br clear="both"/>
    <div className={style['summary']}>
      <Card className={style['md-card-summary']}>
        <CardTitle className={style['card-head-summary']} title="Planetary Options Summary"></CardTitle>
        <CardText>
          <div className={style['two-column']}>
            <div className={style['prop-list']}>
              <div className={style['prop-item']}>
              <label>
                Diameter
              </label>
              <span>
                  {diameter}km
                  <i>{percent(diameter/EARTHS_DIAM)} of Earth</i>

                </span>
            </div>
              <div className={style['prop-item'] + ' '
              + style['prop-item-ex']}>
                <label>
                  Surface Area
                </label>
                <span>
                  {Math.round(surface/1000000)}M km2
                  <i>{percent(surface/surfaceOfEarth)} of Earth</i>

                </span>
              </div>
              <div className={style['prop-item']}>
                <label>
                  Tilt
                </label>
                <span>
                  {tilt}&deg;
                </span>
              </div>

              <div className={style['prop-item'] + ' '
              + style['prop-item-ex']}>
                <label>
                  Equatorial Speed
                </label>
                <span>
                  {eqSpeed}km/hr**
                  <i>{Math.round(100 * eqSpeed/1000)}% of Earth</i>
                </span>
              </div>

            </div>
            <div className={style['prop-list']}>
              <div className={style['prop-item']}>
                <label>
                  Length of Year
                </label>
                <span>
                  {daysInYear} Earth Days*
                </span>
              </div>
              <div className={style['prop-item']}>
                <label>
                  Climate
                </label>
                <span>
                  {climate}&deg; C
                  <i>{Math.abs(climate - 14)}&deg; {climate > 14 ? 'warmer' : 'colder'} than Earth</i>
                </span>
              </div>
              <div className={style['prop-item']}>
                <label>
                  Length of Day
                </label>
                <span>
                  {day} hours
                </span>
              </div>
              <div className={style['prop-item'] + ' '
              + style['prop-item-ex']}>
                <label>
                  Days in the Year
                </label>
                <span>
                  {localDaysInYear} local days
                </span>
              </div>
            </div>
          </div>
          <p>* that is -- number of earth days in the year</p>
          <p>** Earth's equatorial speed is around 1000 km/h</p>
        </CardText>
      </Card>
    </div>
  </div>);
});