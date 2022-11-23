import './style.css';

// functionnal components
import context from "./components/context";
import header from './components/header';
import weather from './components/weather';
import footer from './components/footer';

// web component
import './components/chart';

const weatherComponent = await weather();

document.querySelector('#app').innerHTML = `
  <div id="wrapper" class="text-center">
    ${header()}
    
    <main>
      ${context()}
      ${weatherComponent}
      <div id="chart-container">
        <canvas id="chart" is="chart-canvas"></canvas>
      </div>
    </main >
    
    ${footer()}
  </div >
`