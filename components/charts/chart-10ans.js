import { Chart } from "chart.js/auto";
import { timePeriods, values } from "../../shared/helpers/api.helper";

export class Chart10ans extends HTMLCanvasElement {
  constructor() {
    self = super();

    const [lastTimePeriods, lastValues] = this.getLast10Years(timePeriods, values);

    this.createChart(self, lastTimePeriods, lastValues);

  }

  getLast10Years = (timePeriods, values) => {
    const lastTimePeriods = [];
    const lastValues = [];

    // The iteration is on the 40 latest quarters so we get 10 full years
    for (let i = 0; i < 40; i++) {
      lastTimePeriods.push(timePeriods[timePeriods.length - i]);
      lastValues.push(values[values.length - i]);
    }
    return [lastTimePeriods.reverse(), lastValues.reverse()]
  }

  createChart = (canvas, labels, data) => {
    new Chart(canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: 'Taux de chômage',
          data: data,
          fill: {
            target: "origin",
            above: "#4682B444"
          },
          borderColor: "steelBlue",
          backgroundColor: "steelBlue",
          showLine: true,
          tension: 0
        }]
      }
    })
  }
}
customElements.define('chart-10ans', Chart10ans, { extends: 'canvas' });