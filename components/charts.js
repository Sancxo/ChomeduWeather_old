// web component
import './charts/chart-1975';
import './charts/chart-10ans';

export default function charts(lastUpdate) {
  return `
    <div id="chart-container" class="my-2">
      <h3>Fun with charts:</h3>
      <h4>Graphique des chiffres du chômage de 1975 à nos jours</h4>
      <canvas id="chart-1975" is="chart-1975">Un problème à eu lieu lors du chargement du graphique ...</canvas>
      <h4>Graphique des chiffres du chômage sur les 10 dernières années</h4>
      <canvas id="chart-10ans" is="chart-10ans">Un problème à eu lieu lors du chargement du graphique ...</canvas>
      <p class="mt-0"><sub>Sources: <a href="https://www.insee.fr/fr/statistiques/serie/001688527" target="_blank" rel="noopener">INSEE</a>. Dernière mise à jour : ${lastUpdate}. N.B.: le graphique ci-dessus peut ne pas s'afficher sur mobile.</sub></p>
    </div>
  `
}