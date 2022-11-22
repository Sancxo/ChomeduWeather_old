import './style.css';

let loading = true;

async function fetchData() {
  return await fetch(
    'https://bdm.insee.fr/series/sdmx/data/SERIES_BDM/001688527',
    {
      method: 'GET',
      cache: "no-cache",
      headers: {
        'Accept': "application/vnd.sdmx.structurespecificdata+xml;version=2.1",
      }
    }
  )
    .then(resp => {
      return resp.text()
    })
    .catch(err => {
      console.error(err);
    })
}

async function render() {
  const xml = await fetchData();
  loading = false;

  const rawData = new window.DOMParser().parseFromString(xml, "application/xml");

  const lastUpdate = rawData.getElementsByTagName("Series")[0].attributes["LAST_UPDATE"].nodeValue;

  const body = rawData.getElementsByTagName("Obs");

  let dataTable = {};

  // we want to return an object with this format { 2022: { Q1: "123", Q2: "456", Q3: "789", ...} }
  for (let i = 0; i < body.length; i++) {
    const [year, quarter] = body[i].attributes["TIME_PERIOD"].nodeValue.split("-"); // we split from "2022-Q3" to "2022" and "Q3"
    if (dataTable[year] === undefined) { // if year is not met yet, we write it inside dataTable and yearList
      dataTable[year] = {}
    }

    dataTable[year][quarter] = body[i].attributes["OBS_VALUE"].nodeValue;
  }

  // console.log(dataTable);

  const lastYearsList = []
  // we gonna push the two last years into lastYearsList
  for (let i = 0; i < 2; i++) {
    lastYearsList.push(Object.keys(dataTable).reverse()[i])
  }

  const currentYear = lastYearsList[0];

  const currentYearQuarterList = Object.keys(dataTable[currentYear]); // list of every quarter passed this year from newer to older
  const currentQuarter = currentYearQuarterList[0];

  // I current_quarter is "Q1", the previous one is "Q4" from previous year; if not it's previous quarter from same year.
  const previousOrCurrentYear = currentQuarter === "Q1" ? lastYearsList[1] : currentYear;
  const previousQuarter = currentQuarter === "Q1" ? "Q4" : currentYearQuarterList[1]

  const lastIndicator = dataTable[currentYear][currentQuarter];
  const previousIndicator = dataTable[previousOrCurrentYear][previousQuarter];

  const diff = (lastIndicator - previousIndicator).toFixed(1);

  const condition = lastIndicator < 9 && diff < 0.8 ? true : false;

  document.querySelector('#app').innerHTML = loading ? `<p>Loading ...</p>` : `
    <div id="wrapper" class="text-center">
      <header>
        <h1>Chômedu Weather</h1>
        <h2 class="mb-0">La météo du chômage</h2>
        <p class="mt-0"><sub>Ou encore: &laquo; est-ce le meilleur moment de se faire salement lourder par son boss ? &raquo;</sub></p>

        <hr />
      </header>
      <main>
        <div id="contexte">
          <h3>Contexte:</h3>
          <p>Emmanuel Macron l'a dit, l'assurance chômage doit être <q>&nbsp;plus stricte quand trop d'emplois sont non pourvus, plus généreuse quand le chômage est élevé&nbsp;</q>. Alors à partir du 1er Février 2023, <span class="bold blink">flash promo</span> : c'est -25% sur les durées d'allocations chômage quand l'emploi se porte bien !</p>
          <p>Voici donc les nouvelles règles du jeu de la spéculation du marché de l'emploi, la durée de l'ouverture de vos droits à l'assurance chômage sera dégradée de 25% si :</p>
          <ul class="mt-0">
            <li>Le taux de chômage est inférieur à 9% pendant 3 trimestres consécutifs.</li>
            <li>Le taux de chômage n'a pas augmenté de 0.8 point sur le dernier trimestre.</li>
            <li>Le plancher minimal de l'ouverture aux droits reste de 6 mois.</li>
          </ul>
          <p class="mb-0">Ne sont pas concernés: </p>
          <ul class="mt-0">
            <li>Les personnes résidants dans les DOM.</li>
            <li>Les métiers déjà exemptés de la précédente réforme de l'assurance-chômage (marins, pêcheurs, dockers, intermittents, expatriés).</li>
          </ul>
          <p><sub>Source: <a href="https://www.francetvinfo.fr/economie/emploi/chomage/reforme-de-l-assurance-chomage-on-vous-explique-les-nouvelles-regles-d-indemnisation-des-demandeurs-d-emploi_5490423.html" hreflang="fr" target="_blank" rel="noopener">France Info</a></sub></p>
        </div>
        <div id="weather-container" class="${condition ? "block-danger" : "block-success"}">
          <h3>Est-ce le bon moment se faire virer ?</h3>
          <p class="flex-center mb-0 fs-2 uppercase bold ${condition ? "danger" : "success"}">${condition ? "Non" : "Oui"} ! <span class="fs-3 ml-1">${condition ? "⛈️" : "☀️"}</span></p>
          <p class="mt-0"><sub>${condition ? "Continuez le <span class='italic'>quiet quitting</span>." : "Lâchez-vous, c'est le moment de partir en beauté !"}</sub></p>
          <p id="current-indicator" >
          Au ${currentQuarter} de l'année ${currentYear} : ${lastIndicator}% (${diff})
          </p >
          <p id="previous-indicator">
            Précédement, au ${previousQuarter} de l'année ${previousOrCurrentYear} : ${previousIndicator}%
          </p>
          <p><sub>Données mises à jour trimestriellement. Source: <a href="https://www.insee.fr/fr/statistiques/serie/001688527" target="_blank" rel="noopener">INSEE</a>. Dernière mise à jour : ${lastUpdate}.</sub></p>
        </div>

        <div id="chart-container">
          
        </div>
      </main >
    </div >
  `
}

render();
