import './style.css';
import { nestedDataTable, lastUpdate } from './shared/api-helper';

// functionnal components
import context from "./components/context";
import header from './components/header';
import weather from './components/weather';
import footer from './components/footer';

// web component
import './components/chart';

const weatherComponent = await weather(nestedDataTable, lastUpdate);

document.querySelector('#app').innerHTML = `
  <div id="wrapper" class="text-center">
    ${header()}
    
    <main>
      ${weatherComponent}
      ${context()}
      <div id="chart-container">
        <h3>Graphique des chiffres du chômage de 1975 à nos jours</h3>
        <canvas id="chart" is="chart-canvas">Un problème à eu lieu lors du chargement du graphique ...</canvas>
        <p class="mt-0"><sub>Source: <a href="https://www.insee.fr/fr/statistiques/serie/001688527" target="_blank" rel="noopener">INSEE</a>. Dernière mise à jour : ${lastUpdate}. N.B.: le graphique ci-dessus peut ne pas s'afficher sur mobile.</sub></p>
      </div>
    </main>
    
    ${footer()}
  </div >
`