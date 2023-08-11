import React, { useEffect, useState, useRef, useCallback, useMemo } from "react"
import './App.css'
import * as d3 from 'd3'

import { JsonView, collapseAllNested, darkStyles, defaultStyles } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'

import wppLogo from './assets/WPP-Logo.png'
import stateGeoJSON from './assets/cb_2018_us_state_5m.json' // https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html
import countyGeoJSON from './assets/cb_2018_us_county_20m.json' // https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html

function App() {
  const d3GeoRef = useRef();
  const areaText = useRef();

  const [clickedLngLat, setClickedLngLat] = useState([-1,-1]);
  const [selectedName, setSelectedName] = useState('');
  const [selectedFeature, setSelectedFeature] = useState('');
  const [areaTextValue, setAreaTextValue] = useState('ID,Lat,Long\r\nNew york,40.67,-73.94\r\nLos angeles,34.11,-118.41\r\nChicago,41.84,-87.68\r\nHouston,29.77,-95.39\r\nPhiladelphia,40.01,-75.13\r\nPhoenix,33.54,-112.07\r\nSan diego,32.81,-117.14\r\nSan antonio,29.46,-98.51\r\nDallas,32.79,-96.77\r\nDetroit,42.38,-83.1\r\n');
  const [geojson, setGeojson] = useState(stateGeoJSON);
  const [geojsonOption, setGeojsonOption] = useState('state');
  const [delimiter, setDelimiter] = useState('comma');
  const [data, setData] = useState([[]]);

  var delimiterLookup = {
    'comma': ',',
    'tab': '\t'
  };

  const geojsonOptions = {
    'state': stateGeoJSON,
    'county': countyGeoJSON
  };

  useEffect(() => {
    setGeojson(geojsonOptions[geojsonOption]);
    // console.log(geojsonOption);
  }, [geojsonOption]);

  const latLongDecimal = new Intl.NumberFormat("en-IN", {
    maximumSignificantDigits: 6,
  });

  function IdentifyRegions(lng, lat) {
    // var regions = []
    // geojson.features.forEach(function(d) {
    //   if(d3.geoContains(d, [lng, lat])){
    //     regions.push(d.properties.NAME);
    //   }
    // })
    // return regions;

    for(var i in geojson.features){
      var d = geojson.features[i];
      if(d3.geoContains(d, [lng, lat])){
        return d.properties.NAME;
      }
    }
    return '';
  };

  function ProcessData(text, delimiter) {
    var rows = text.split('\n');
    var result = [];

    var newRows = []
    for(var rowNum in rows){
      var values = rows[rowNum].split(delimiterLookup[delimiter]);
      if(values.length >= 3){
        var region = IdentifyRegions(+values[2],+values[1]);
        values.push(region);
        result.push(values);
      }
      newRows.push(values.join(delimiterLookup[delimiter]));
    }
    var newText = newRows.join('\n');

    setAreaTextValue(newText);
    setData(result);
    return newText;
  };

  // useEffect: Gets called on initial load of the DOM, 
  // and on every update of the specified variables.
  useEffect(() => {
    var context = d3.select(d3GeoRef.current)
      .node()
      .getContext('2d');

      var projection = d3.geoAlbersUsa().scale(800);
      // var projection = d3.geoEqualEarth();
    
    var geoGenerator = d3.geoPath()
      .projection(projection)
      .context(context);

    d3.select(d3GeoRef.current).on('click', feature => {
      setClickedLngLat(projection.invert([feature.offsetX, feature.offsetY]));
    });

    function update() {
      context.clearRect(0, 0, 800, 400);
      setSelectedName('');
      
      geojson.features.forEach(function(d) {
        context.beginPath();
        context.fillStyle = clickedLngLat && d3.geoContains(d, clickedLngLat) ? 'red' : '#aaa';
        if(d3.geoContains(d, clickedLngLat)){
          setSelectedName(d.properties.NAME);
          setSelectedFeature(d);
          // setSelectedFeature(IdentifyRegions(clickedLngLat[0],clickedLngLat[1]));
        }
        geoGenerator(d);
        context.fill();
      })

      context.fillStyle = '#0049bf';
      // Draw points on graphic.
      for(var i in data){
        if(data[i].length >=3){
          console.log(data[i]);
          var lat = data[i][1];
          var lng = data[i][2];
          var pixelLocation = projection([lng,lat]);
          console.log(pixelLocation);
          try{
            context.fillRect(pixelLocation[0],pixelLocation[1],5,5);
          }catch(e){
          }
        }
      }
    }
    update();
  }, [clickedLngLat, geojson, data]); // Any update to these variables will call-back to this useEffect() routine.

  
  return (
    <>
      <div>
        <a href="https://www.westernpowerpool.org/" target="_blank">
          <img src={wppLogo} className="logo" alt="WPP Logo" />
        </a>
      </div>

      <h1>State Identifier</h1>
      
      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div> */}

      <div>Paste data here:</div>
      <textarea ref={areaText} value={areaTextValue} onChange={e=>setAreaTextValue(e.target.value)} className="w-4/5 h-40"></textarea>
      <div>
        Parsing Method: -
        <select value={delimiter} onChange={e => setDelimiter(e.target.value)}>
          <option value="comma">Comma</option>
          <option value="tab">Tab</option>
        </select>
      </div>
      <div>
        GeoJSON To Use: -
        <select value={geojsonOption} onChange={e => setGeojsonOption(e.target.value)}>
          <option value='state'>State</option>
          <option value='county'>County</option>
        </select>
      </div>

      <div>
        <button onClick={e => ProcessData(areaText.current.value, delimiter)}>Process Data</button>
      </div>

      <div id="content">
        <div>Click an area to highlight</div>
        <canvas ref={d3GeoRef} width="800" height="600"></canvas>
      </div>

      <div>
        Selected Region: {selectedName} 
      </div>
      <div>
        Selected Lat/Long: {latLongDecimal.format(clickedLngLat[1])}, {latLongDecimal.format(clickedLngLat[0])}
      </div>
      <div></div>

      <div className="text-left	">
        Selected Region's JSON Data: 
        <JsonView data={selectedFeature} shouldInitiallyExpand={collapseAllNested } style={darkStyles} />
      </div>

    </>
  )
}

export default App
