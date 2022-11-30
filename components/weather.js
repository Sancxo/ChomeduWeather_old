import { getAllPredictions, saveGroundTruth } from "../shared/helpers/supabase.helper";
import perceptron from "./perceptron";

export default async function weather(nestedDataTable, lastUpdate) {
  async function setTruthWhenAvailable() {
    const data = await getAllPredictions();

    for (let i = 0; i < data.length; i++) {
      const [year, quarter] = data[i].time_period.split("-");

      // We check if the nestedDataTable has value for this time period
      if (nestedDataTable[year][quarter]) saveGroundTruth(data[i].time_period, nestedDataTable[year][quarter])
    }
  }

  const lastYearsList = []
  // we gonna push only the two last years into lastYearsList
  for (let i = 0; i < 2; i++) {
    lastYearsList.push(Object.keys(nestedDataTable).reverse()[i])
  }

  const currentYear = lastYearsList[0];

  const currentYearQuarterList = Object.keys(nestedDataTable[currentYear]); // list of every quarter passed this year from newer to older
  const currentQuarter = currentYearQuarterList.reverse()[0];

  // If current_quarter is "Q1", the previous one is "Q4" from previous year; if not it's previous quarter from same year.
  const previousOrCurrentYear = currentQuarter === "Q1" ? lastYearsList[1] : currentYear;
  const currentOrNextYear = currentQuarter === "Q4" ? parseInt(currentYear) + 1 : currentYear;

  const previousQuarter = currentQuarter === "Q1" ? "Q4" : currentYearQuarterList[1];
  const nextQuarter = currentQuarter === "Q1" && "Q2" || currentQuarter === "Q2" && "Q3" || currentQuarter === "Q3" && "Q4" || currentQuarter === "Q4" && "Q1"

  const lastIndicator = nestedDataTable[currentYear][currentQuarter];
  const previousIndicator = nestedDataTable[previousOrCurrentYear][previousQuarter];

  const diff = (lastIndicator - previousIndicator).toFixed(1);

  const condition = lastIndicator < 9 && diff < 0.8 ? true : false;

  setTruthWhenAvailable();

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
    ${perceptron(nextQuarter, currentOrNextYear)}
  `
}