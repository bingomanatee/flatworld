const CoordinateDisplay = (props) => {
  const {mapArray, errors, x, y, validCoords} = props;
  if (errors.length) {
    return <div className="coord-display-errors">
      {errors.map((error, i) => <div key={`error-${i}-${error}`} className="coord-display-errors--error">
        {error}
      </div>)}
    </div>
  }

  let vcMessage = '';
  if (!validCoords) {
    vcMessage = <div className="coord-display-errors">
      <div key="invalid Coords" className="coord-display-errors--error">
        Invalid Coordinartes
      </div>
    </div>
  }

  return <div className="coord-display">
    <h3>({x}, {y})</h3>
    {mapArray.map((letters, letterY) => (
      <div key={`letter-row-${letterY}-${letters}`} className="coord-display--row">
        {letters.split('')
                .map(
                  (letter, letterX) =>
                    <DisplayLetter
                      key={`letter-${letterX}-${letterY}`}
                      {...props}
                      x={x} y={y}
                      {...{
                        letterX,
                        letterY,
                        letter
                      }}
                    ></DisplayLetter>
                )
        }</div>))}
    {vcMessage}
  </div>
}

const DisplayLetter = ({letter, letterX, letterY, x, y, selectCoords}) => {
  const target = ((parseInt(letterX) === parseInt(x)) && (parseInt(letterY) === parseInt(y)))
  letter = letter.toUpperCase();
  const coords = <div className="display-letter--coords">({letterX},{letterY})</div>;
  const coordsT = ''; //<div className="display-letter--coords">({x},{y}) {target ? 'T' : '' }</div>;
  const textClass = target ? 'display-letter--label display-letter--label-target' : 'display-letter--label';
  let subclass = '';
  let name = '';
  switch (letter) {
    case 'W':
      subclass = 'water';
      name = 'Water';
      break;

    case 'O':
      subclass = 'ocean';
      name = 'Ocean';
      break;

    case 'L':
      subclass = 'land';
      name = 'land';
      break;

    default:
      return '';
  }

  if (target) {
    subclass += ' display-letter-target';
  }
  return <div className={'display-letter display-letter-' + subclass} onClick={() => selectCoords(letterX, letterY)}>
    <span className={textClass}>{name}</span>
    {coords}
    {coordsT}
  </div>;
}

const DATA_ENTRY = 1;
const FLOODING = 2;
const FLOODED = 3;

const INITIAL = {
  mapString: '',
  mapArray: [],
  asArray: false,
  errors: [],
  validCoords: false,
  floodState: DATA_ENTRY,
  x: 0,
  y: 0
}

const FLOOD_TIME = 2000;

/**
 * note - mapArray/mapData is [y][x]
 */
class WaterApp extends React.Component {
  constructor (props) {
    super(props)
    this.state = Object.assign({}, INITIAL, {errors: [], mapArray: []});
  }

  setCoords (x, y) {
    x = parseInt(x);
    y = parseInt(y);
    let data = this.mapData(this.state.mapString, x, y);
    console.log('setCoords data:', data);
    this.setState({x, y, ...data});
  }

  updateMapString (mapString) {
    this.setState({mapString, ... this.mapData(mapString, this.state.x, this.state.y)});
  }

  updateX (x) {
    x = parseInt(x);
    this.setState({x, ...this.mapData(this.state.mapString, x, this.state.y)})
  }

  updateY (y) {
    y = parseInt(y);
    this.setState({y, ...this.mapData(this.state.mapString, this.state.x, y)})
  }

  flood () {
    if (!this.state.validCoords) {
      alert('your coordinates are bad. And you are bad.');
    }

    this.setState({floodState: FLOODING, mapArray: this.purgedOceans(this.state.mapArray)}, () => {
      this.floodTimeout = setTimeout(() => this.expandFlood(), FLOOD_TIME);
    })
  }

  expandFlood () {
    let coords = this.state.mapArray.map((letters) => letters.split(''));
    let changed = false;

    switch (coords[this.state.y][this.state.x]) {
      case 'O':
        console.log('secondary flooding!!!!');
        let currentOceanMap = new Map();
        for (let y in coords) {
          for (let x in coords[y]) {
            let iy = parseInt(y);
            let ix = parseInt(x);
            if (coords[iy][ix] === 'O') {
              console.log('found ocean at ', x, y);
              currentOceanMap.set(`${x}-${y}`, {x: ix, y: iy});
            }
          }
        }

        for (let oceanCoord of Array.from(currentOceanMap.values())) {
          let coordSet = [
            {x: oceanCoord.x - 1, y: oceanCoord.y},
            {x: oceanCoord.x + 1, y: oceanCoord.y},
            {x: oceanCoord.x, y: oceanCoord.y - 1},
            {x: oceanCoord.x, y: oceanCoord.y + 1}
          ];

          for (let coord of coordSet) {
            let {x, y} = coord;
            if (!currentOceanMap.get(`${x},${y}`)) {
              if (coords[y] && coords[y][x] && coords[y][x] === 'W') {
                coords[y][x] = 'O';
                changed = true;
                currentOceanMap.set(`${x}-${y}`, true);
                console.log('flipped ocean at ', x, y);
              } else {
                console.log('... not a water square');
              }
            } else {
              console.log('... already flooded');
            }
          }

        }

        break;

      case 'W':
        coords[this.state.y][this.state.x] = 'O';
        changed = true;
        break;

      default:
        this.setState({floodState: FLOODED});
        return;
    }

    if (!changed) {
      this.setState({floodState: FLOODED});
      return;
    }
    coords = coords.map((ys) => ys.join(''));
    this.setState({mapArray: coords});
    this.floodTimeout = setTimeout(() => this.expandFlood(), FLOOD_TIME)
  }

  purgedOceans (data) {
    return data.map((letters) => letters.replace(/O/ig, 'W'));
  }

  mapData (mapString, x, y) {

    if (this.state.floodState !== DATA_ENTRY) {
      let {mapArray, asArray, validCoords, errors} = this.state;
      return {mapArray, asArray, validCoords, errors};
    }

    let errors = [];
    let mapArray = [];
    let validCoords = true;
    let asArray = false;
    if (!mapString) {
      errors.push('enter a coordinate set');
    } else if (/[\[,''\]]+/.test(mapString)) {
      let invalid = false;
      asArray = true;
      try {
        mapArray = eval(mapString);
      } catch (err) {
        errors.push('invalid array');
      }
      if (!invalid) {
        if (!Array.isArray(mapArray)) {
          errors.push('invalid array');
        } else {
          for (let row of mapArray) {
            if (typeof row !== 'string') {
              errors.push('invalid row value - each element must be a string');
              break;
            }
          }
        }
      }
    } else {
      mapArray = mapString.split("\n");
      if (!mapArray.length) {
        errors.push('please enter coordinates');
      }
    }
    mapArray = mapArray.map((letters) => (typeof(letters) === 'string') ? letters.toUpperCase()
                                                                                 .replace(/[^WLO]/g, '') : '');
    const maxLength = mapArray.reduce((max, letters) => {
      return Math.max(max, letters.length)
    }, 0);
    const water = 'W'.repeat(maxLength);
    mapArray = mapArray.map((letters) => (letters + water).substring(0, maxLength));

    if (!(mapArray[y] && mapArray[y].length > x && x >= 0)) {
      console.log('cant find x and y ', x, y, 'in', mapArray);
      validCoords = false;
    }
    return {mapArray, asArray, validCoords, errors};
  }

  floodControls () {
    switch (this.state.floodState) {
      case  DATA_ENTRY:
        return <button className="flood-button" onClick={() => this.flood()} disabled={!this.state.validCoords}>Flood
          Coordinates</button>;
        break;

      case FLOODING:
        return <p className="flood-message">flooding; please wait...</p>;
        break;

      case FLOODED:
        return <p>Flooding Done! <button className="flood-button" onClick={() => this.reset()}>Try Again</button>;</p>
      default:
        return <p>Flooding Done! <button className="flood-button" onClick={() => this.reset()}>Try Again</button>;</p>
    }
  }

  reset () {
    this.setState(Object.assign({}, INITIAL, {errors: [], mapArray: []}));
  }

  render () {
    const {x, y, mapString, mapArray, validCoords, errors, floodState} = this.state;
    return (
      <div>
        <div>
          <h2>LandLubber</h2>
          <div className="input-row input-row-map">
           <textarea rows="4" value={mapString} className="field"
                     onChange={(event) => this.updateMapString(event.currentTarget.value)}/>
            <pre className="actual-map">{mapArray.join("\n")}</pre>
          </div>
        </div>
        <div>
          <h2>Coordinates ({x}, {y})</h2>
          <div className="input-row input-row-coords">
            <label>X:</label>
            <input type="number" min="0" value={x} className="field field-number" disabled={floodState !== DATA_ENTRY}
                   onChange={(event) => this.updateX(event.currentTarget.value)}/>
            <label>Y:</label>
            <input type="number" min="0" value={y} className="field field-number" disabled={floodState !== DATA_ENTRY}
                   onChange={(event) => this.updateY(event.currentTarget.value)}/>
          </div>
          <div>
            {this.floodControls()}
          </div>
        </div>
        <CoordinateDisplay {... {
          x,
          y,
          validCoords,
          selectCoords: (x, y) => this.setCoords(x, y),
          mapArray,
          errors
        }}></CoordinateDisplay>
        <small>
          You can enter map String as a nested array
          <pre>
{`['WWWLLWW',
'LLWWLLW',
'WWWLLLL'
]`}

            </pre>
          or simply as the raw values:
          <pre>
{`WWWLLWW
LLWWLLW
WWWLLLL`}
</pre>
        </small>
      </div>
    )
  }
}

ReactDOM.render(<WaterApp/>, document.querySelector("#app"))
