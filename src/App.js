import React, {useState,useEffect} from 'react';
import './App.css';
import {FormControl,Select,MenuItem,Card,CardContent} from '@material-ui/core'
import InfoBox from './InfoBox';
import Map from './Map';
import LineGraph from './LineGraph';
import Table from './Table'
import {sortData,prettyPrintStat} from './utils.js'
import "leaflet/dist/leaflet.css";

function App() {

  const[countries,setCountries]=useState([]);
  const[country,setCountry]=useState("worldwide");
  const[countryInfo,setCountryInfo]=useState({});
  const[tableData,setTableData]=useState([]);
  const[mapCenter,setMapCenter]=useState([34.80746,-40.4796]);
  const[mapZoom,setMapZoom]=useState(3);
  const[mapCountries,setMapCountries]=useState([]);
  const[casesType,setCaseType]=useState("cases")

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

      countryCode=== "worldwide" ? setMapCenter([34.80746,-40.4796]) 
      :setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      
      // setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
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
          <InfoBox isRed active={casesType==="cases"} onClick={(e)=>setCaseType("cases")} title="Covid-19 Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}></InfoBox>
          <InfoBox active={casesType==="recovered"} onClick={(e)=>setCaseType("recovered")}title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}></InfoBox>
          <InfoBox isRed active={casesType==="deaths"} onClick={(e)=>setCaseType("deaths")} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}></InfoBox>
        </div>

        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>

      <Card className="app_right">
        <CardContent>
          <h2>Live Cases by country</h2>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
