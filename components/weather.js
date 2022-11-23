export default async function weather() {
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
        loading = false;
        return resp.text()
      })
      .catch(err => {
        console.error(err);
      })
  }

  function createDataObject(xmlData) {
    let object = new Object();
    const body = xmlData.getElementsByTagName("Obs");

    // we want to return an object with this format { 2022: { Q1: "123", Q2: "456", Q3: "789", ...} }
    for (let i = 0; i < body.length; i++) {
      const [year, quarter] = body[i].attributes["TIME_PERIOD"].nodeValue.split("-"); // we split from "2022-Q3" to "2022" and "Q3"
      if (object[year] === undefined) { // if year is not met yet, we write it inside object
        object[year] = {}
      }

      object[year][quarter] = body[i].attributes["OBS_VALUE"].nodeValue;
    }

    return object;
  }

  const xml = await fetchData();
  const rawData = new window.DOMParser().parseFromString(xml, "application/xml");

  const lastUpdate = rawData.getElementsByTagName("Series")[0].attributes["LAST_UPDATE"].nodeValue;
  const dataTable = createDataObject(rawData);

  // console.log(dataTable)

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

  if (loading) {
    return `Loading ...`
  } else {
    return `
      <div id="weather-container" class="my-2 ${condition ? "block-danger" : "block-success"}">
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
    `
  }
}