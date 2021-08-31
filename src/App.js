import React, {useState,useEffect} from 'react';
import './App.css';
import {FormControl,Select,MenuItem,Card,CardContent} from '@material-ui/core'
import InfoBox from './InfoBox';
import Map from './Map';
import LineGraph from './LineGraph';
import Table from './Table'
import {sortData} from './utils.js'
import "leaflet/dist/leaflet.css";

function App() {

  const[countries,setCountries]=useState([]);
  const[country,setCountry]=useState("worldwide");
  const[countryInfo,setCountryInfo]=useState({});
  const[tableData,setTableData]=useState([]);
  const[mapCenter,setMapCenter]=useState([34.80746,-40.4796]);
  const[mapZoom,setMapZoom]=useState(3);
  const[mapCountries,setMapCountries]=useState([]);

  useEffect(() => {

    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data);
    })
  }, [])


  useEffect(()=>{

    const getCountriesData = async()=>{

      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries= data.map((country)=>({
          name:country.country,
          value:country.countryInfo.iso2
        }))

        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);
      }) 
    }

    getCountriesData();    
  },[]);

  const onCountryChange= async (event)=>{

    const countryCode = event.target.value;
    

    const url = countryCode==="worldwide" ?
     "https://disease.sh/v3/covid-19/all" : 
     "https://disease.sh/v3/covid-19/countries/"+countryCode;

     await fetch(url)
     .then((response)=>response.json())
     .then((data)=>{

      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(4);
     })
  }
  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">

          <Select variant="outlined" value={country} onChange={onCountryChange}>

          <MenuItem value="worldwide">Worldwide</MenuItem>

          {countries.map((country)=>(
            <MenuItem value={country.value}>{country.name}</MenuItem>))
          }

          </Select>
          </FormControl>
      </div>

        <div className="app_stats">
          <InfoBox title="Covid-19 Cases" cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}></InfoBox>
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}></InfoBox>
        </div>

        <Map countries={mapCountries} center={mapCenter} zoom={mapZoom} casesType="cases" />
      </div>

      <Card className="app_right">
        <CardContent>
          <h2>Live Cases by country</h2>
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
