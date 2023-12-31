import React, { useEffect, useState, useRef, useCallback, useMemo } from "react"
import './App.css'
import * as d3 from 'd3'

import { JsonView, collapseAllNested, darkStyles, defaultStyles } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'

import wppLogo from './assets/WPP-Logo.png'
import wppLogoCircle from './assets/WPP-Logo-Circle.png'
import stateGeoJSON from './assets/cb_2018_us_state_5m.json' // https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html
import countyGeoJSON from './assets/cb_2018_us_county_20m.json' // https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html

// Electric Retail Service Territories https://atlas.eia.gov/datasets/f4cd55044b924fed9bc8b64022966097/explore

function App() {
  const d3GeoRef = useRef();
  const areaText = useRef();

  const [clickedLngLat, setClickedLngLat] = useState([-1,-1]);
  const [selectedName, setSelectedName] = useState('');
  const [selectedFeature, setSelectedFeature] = useState('');
  const [areaTextValue, setAreaTextValue] = useState('ID,Lat,Long\r\nNew york,40.67,-73.94\r\nLos angeles,34.11,-118.41\r\nChicago,41.84,-87.68\r\nHouston,29.77,-95.39\r\nPhiladelphia,40.01,-75.13\r\nPhoenix,33.54,-112.07\r\nSan diego,32.81,-117.14\r\nSan antonio,29.46,-98.51\r\nDallas,32.79,-96.77\r\nDetroit,42.38,-83.1\r\n');
  const [geojson, setGeojson] = useState(stateGeoJSON);
  const [geojsonOption, setGeojsonOption] = useState('state');
  const [delimiterOption, setDelimiterOption] = useState('comma');
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
  }, [geojsonOption]);

  const latLongDecimal = new Intl.NumberFormat("en-IN", {
    maximumSignificantDigits: 6,
  });

  function IdentifyRegions(lng, lat) {
    var regions = []
    for(var i in geojson.features){
      var d = geojson.features[i];
      if(d3.geoContains(d, [lng, lat])){
        regions.push(d.properties.NAME);
      }
    }
    return regions;
  };

  function TextToTable(text, delimiter) {
    var rows = text.split('\n');
    var result = [];
    for(var rowNum in rows){
      var values = rows[rowNum].split(delimiter);
      result.push(values);
    }
    return result;
  }

  function TableToText(table, delimiter) {
    var textRows = [];
    for(let row of table){
      textRows.push(row.join(delimiter));
    }
    return textRows.join('\n');
  }

  function ProcessData(text, delimiter) {
    console.log(delimiterOption);
    console.log(delimiter);
    var table = TextToTable(text, delimiter);
    for(let row of table){
      var regions = IdentifyRegions(+row[2],+row[1]);
      row.push(regions.join('|'));
    }

    setAreaTextValue(TableToText(table, delimiter));
    setData(table);
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
          var lat = data[i][1];
          var lng = data[i][2];
          var pixelLocation = projection([lng,lat]);
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
          <img src={wppLogoCircle} className="logo" alt="WPP Logo" />
        </a>
        <h1>WPP State Identifier</h1>
      </div>

      <div>Paste data here:</div>
      <textarea ref={areaText} value={areaTextValue} onChange={e=>setAreaTextValue(e.target.value)} className="w-4/5 h-40 bg-gray-200 text-black rounded-lg "></textarea>
      <div>
        Parsing Method: -
        <select value={delimiterOption} onChange={e => setDelimiterOption(e.target.value)} className="bg-gray-200 text-black rounded-lg">
          <option value="comma">Comma</option>
          <option value="tab">Tab</option>
        </select>
      </div>
      <div>
        GeoJSON To Use: -
        <select value={geojsonOption} onChange={e => setGeojsonOption(e.target.value)} className="bg-gray-200 text-black rounded-lg">
          <option value='state'>State</option>
          <option value='county'>County</option>
        </select>
      </div>
      <div>
      {/* <img src={wppLogoCircle} className="logo" alt="WPP Logo" className="animate-spin"/> */}
      <button onClick={e => ProcessData(areaText.current.value, delimiterLookup[delimiterOption])}>Process Data</button>
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

      {/* <div className="text-left	">
        Selected Region's JSON Data: 
        <JsonView data={selectedFeature} shouldInitiallyExpand={collapseAllNested } style={darkStyles} />
      </div> */}

    </>
  )
}

export default App
