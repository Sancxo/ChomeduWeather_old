import './style.css';

import context from "./components/context";
import header from './components/header';
import weather from './components/weather';
import footer from './components/footer';

document.querySelector('#app').innerHTML = `
    <div id="wrapper" class="text-center">
      ${header()}
      
      <main>
        ${context()}
        ${await weather()}
        <div id="chart-container">
          
        </div>
      </main >
      
      ${footer()}
    </div >
  `