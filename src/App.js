import React, {useState,useEffect} from 'react';
import './App.css';
import {FormControl,Select,MenuItem,Card,CardContent} from '@material-ui/core'
import InfoBox from './InfoBox';
import Map from './Map';

function App() {

  const[countries,setCountries]=useState([]);
  const[country,setCountry]=useState("worldwide")

  useEffect(()=>{

    const getCountriesData = async()=>{

      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries= data.map((country)=>({
          name:country.country,
          value:country.countryInfo.iso2
        }))
        setCountries(countries)
      }) 
    }

    getCountriesData();    
  },[]);

  const onCountryChange=(event)=>{
    setCountry(event.target.value);
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
          <InfoBox title="Covid-19 Cases" cases={131} total={551521}></InfoBox>
          <InfoBox title="Recovered" cases={121} total={12121}></InfoBox>
          <InfoBox title="Deaths" cases={1212321} total={45465}></InfoBox>
        </div>

        <Map />
      </div>

      <Card className="app_right">
        <CardContent>
          <h2>Live Cases by country</h2>
          {/* Table */}
          <h3>Worldwide new cases</h3>
          {/* graph */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
