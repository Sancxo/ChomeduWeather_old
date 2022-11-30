import './style.css';
import { nestedDataTable, lastUpdate } from './shared/helpers/api.helper';

// functionnal components
import context from "./components/context";
import header from './components/header';
import weather from './components/weather';
import footer from './components/footer';
import charts from './components/charts';

const weatherComponent = await weather(nestedDataTable, lastUpdate);

document.querySelector('#app').innerHTML = `
  <div id="wrapper" class="text-center">
    ${header()}
    
    <main>
      ${weatherComponent}
      ${context()}
      ${charts(lastUpdate)}
    </main>
    
    ${footer()}
  </div >
`