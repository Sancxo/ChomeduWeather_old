import './style.css'
import javascriptLogo from './javascript.svg'

function fetch_data() {
  fetch(
    'https://api.insee.fr/series/BDM/V1/data/SERIES_BDM/001688527?startPeriod=2022-Q2&endPeriod=2022-Q3',
    {
      method: 'GET',
      mode: "cors",
      cache: "no-cache",
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${env('INSEE_API_KEY')}`,
        'Accept': "application/vnd.sdmx.structurespecificdata+xml;version=2.1",
        'Content-Type': "application/xml"
      }
    }
  )
    .then(resp => {
      console.debug(resp)
    })
    .catch(err => {
      console.error(err);
    })
}

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))