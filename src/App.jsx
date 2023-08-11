import React, { useEffect, useState, useRef, useCallback, useMemo } from "react"
import './App.css'
import * as d3 from 'd3'

import { JsonView, collapseAllNested, darkStyles, defaultStyles } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'

import stateGeoJSON from './assets/cb_2018_us_state_5m.json'

function App() {
  const d3GeoRef = useRef();
  const areaText = useRef();

  const [count, setCount] = useState(0);
  const [clickedLngLat, setClickedLngLat] = useState([-1,-1]);
  const [selectedName, setSelectedName] = useState('');
  const [selectedFeature, setSelectedFeature] = useState('');
  const [areaTextValue, setAreaTextValue] = useState('ID,Lat,Long\r\nNew york,40.67,-73.94\r\nLos angeles,34.11,-118.41\r\nChicago,41.84,-87.68\r\nHouston,29.77,-95.39\r\nPhiladelphia,40.01,-75.13\r\nPhoenix,33.54,-112.07\r\nSan diego,32.81,-117.14\r\nSan antonio,29.46,-98.51\r\nDallas,32.79,-96.77\r\nDetroit,42.38,-83.1\r\n');
  const [geojson, setGeojson] = useState(stateGeoJSON);
  const [delimiter, setDelimiter] = useState('\t');

  const latLongDecimal = new Intl.NumberFormat("en-IN", {
    maximumSignificantDigits: 6,
  });

  const selectedGeoChange = (e) => {

  };

  function ParseExcelText() {

  }
  
  function IdentifyRegions(lng, lat) {
    const regions = []
    geojson.features.forEach(function(d) {
      if(d3.geoContains(d, [lng, lat])){
        regions.push(d.properties.NAME);
      }
    })
    return regions;
  }



  // useEffect: Gets called on initial load of the DOM, 
  // and on every update of the specified variables.
  useEffect(() => {
    var context = d3.select(d3GeoRef.current)
      .node()
      .getContext('2d');

    var projection = d3.geoAlbersUsa()
    .scale(800);
    
    var geoGenerator = d3.geoPath()
      .projection(projection)
      .context(context);

    d3.select(d3GeoRef.current).on('click', feature => {
      // var pos = d3.mouse(feature)
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
    }

    update();
  }, [clickedLngLat, geojson]); // Any update to these variables will call-back to this useEffect() routine.

  
  return (
    <>
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
          <option value="\t">CSV</option>
          <option value=",">Tab-Delimited (Pasted from Excel)</option>
        </select>
      </div>
      <div>
        GeoJSON To Use: -
        <select value='a'>
          <option value={stateGeoJSON}>State</option>
          <option value={'test'}>County</option>
        </select>
      </div>

      <div>
        <button>Process Data</button>
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
      <div className="text-left	">
        Selected Region's JSON Data: 
        <JsonView data={selectedFeature} shouldInitiallyExpand={collapseAllNested } style={darkStyles} />
      </div>

    </>
  )
}

export default App
