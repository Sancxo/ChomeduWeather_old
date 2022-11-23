import { Chart } from "chart.js/auto";
import { timePeriods, values } from "../shared/api-helper";

export class ChartCanvas extends HTMLCanvasElement {
  constructor() {
    self = super();

    this.createChart(self);
  }

  createChart = (self) => {
    new Chart(self, {
      type: "line",
      data: {
        labels: timePeriods.reverse(),
        datasets: [{
          label: 'Pourcentage de chômeurs depuis 1975',
          data: values.reverse(),
          fill: {
            target: "origin",
            above: "#4682B444"
          },
          borderColor: "steelBlue",
          tension: 0
        }]
      }
    });
  }
}
customElements.define('chart-canvas', ChartCanvas, { extends: 'canvas' });