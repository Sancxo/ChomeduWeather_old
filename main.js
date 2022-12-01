import './style.css';
import { nestedDataTable, lastUpdate } from './shared/helpers/api.helper';
import { getAllPredictions, saveGroundTruth } from "./shared/helpers/supabase.helper";


// functionnal components
import context from "./components/context";
import header from './components/header';
import weather from './components/weather';
import footer from './components/footer';
import charts from './components/charts';
import predictionsResults from './components/predictionsResults';

const weatherComponent = await weather(nestedDataTable, lastUpdate);

async function setGroundTruthWhenAvailable(data) {
  for (let i = 0; i < data.length; i++) {
    const [year, quarter] = data[i].time_period.split("-");

    // We check if the nestedDataTable has value for this time period
    if (nestedDataTable[year][quarter]) saveGroundTruth(data[i].time_period, nestedDataTable[year][quarter])
  }
}

const data = await getAllPredictions();
setGroundTruthWhenAvailable(data);

document.querySelector('#app').innerHTML = `
  <div id="wrapper" class="text-center">
    ${header()}
    
    <main class="mx-auto">
      ${weatherComponent}
      ${context()}
      ${charts(lastUpdate)}
      ${predictionsResults(data)}
    </main>
    
    ${footer()}
  </div >
`