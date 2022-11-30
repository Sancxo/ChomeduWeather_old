import './style.css';
import { nestedDataTable, lastUpdate } from './shared/api-helper';

// functionnal components
import context from "./components/context";
import header from './components/header';
import weather from './components/weather';
import footer from './components/footer';
import charts from './components/charts';
import simple_nn from './components/simple_nn';

const weatherComponent = await weather(nestedDataTable, lastUpdate);

document.querySelector('#app').innerHTML = `
  <div id="wrapper" class="text-center">
    ${header()}
    
    <main>
      ${weatherComponent}
      ${simple_nn()}
      ${context()}
      ${charts(lastUpdate)}
    </main>
    
    ${footer()}
  </div >
`