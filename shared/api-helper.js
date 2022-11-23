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

function createDataTables(data) {
  const timePeriods = [];
  const values = [];

  for (let i = 0; i < data.length; i++) {
    timePeriods.push(data[i].attributes["TIME_PERIOD"].nodeValue);
    values.push(data[i].attributes["OBS_VALUE"].nodeValue);
  }

  return [timePeriods, values]
}

function createNestedDataObject(timePeriods, values) {
  const object = new Object();

  // we want to return an object with this format { 2022: { Q1: "123", Q2: "456", Q3: "789", ...} }
  for (let i = 0; i < timePeriods.length; i++) {
    const [year, quarter] = timePeriods[i].split("-"); // we split from "2022-Q3" to "2022" and "Q3"
    if (object[year] === undefined) { // if year is not met yet, we write it inside object
      object[year] = {}
    }

    object[year][quarter] = values[i];
  }

  return object;
}

const xml = await fetchData();
const parsedXml = new window.DOMParser().parseFromString(xml, "application/xml");

const dataCollection = parsedXml.getElementsByTagName("Obs");

const [timePeriods, values] = createDataTables(dataCollection);

const nestedDataTable = createNestedDataObject(timePeriods, values);
const lastUpdate = parsedXml.getElementsByTagName("Series")[0].attributes["LAST_UPDATE"].nodeValue;

export { lastUpdate, timePeriods, values, nestedDataTable };