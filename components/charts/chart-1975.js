import { Chart } from "chart.js/auto";
import { timePeriods, values } from "../../shared/api-helper";

export class Chart1975 extends HTMLCanvasElement {
  constructor() {
    self = super();
    const timeData = timePeriods;
    const valueData = values;

    // // Formatting data for scatter plots
    // const data = [];
    // for (let i = 0; i < timePeriods.length; i++) {
    //   data.push({ x: timePeriods[i], y: values[i] })
    // }

    this.createChart(self, timeData, valueData);
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
    });
  }
}
customElements.define('chart-1975', Chart1975, { extends: 'canvas' });