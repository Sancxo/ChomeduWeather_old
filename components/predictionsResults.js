export default function predictionsResults(data) {
  function createRows(data) {
    // console.log(data);
    let rows = "";
    for (let i = 0; i < data.length; i++) {
      const predictedValue = data[i].predicted_value;
      const groundTruth = data[i].ground_truth;

      const diff = (predictedValue - groundTruth).toFixed(1);

      const isPredictionRight = () => {
        if (!groundTruth) {
          return ["", "En attente"]
        } else if (diff == 0.0) {
          return ["block-success", "succès"];
        } else if (diff > 0 || diff < 0) {
          return ["block-danger", "échec"];
        }
      };

      const [color, isSuccess] = isPredictionRight();

      rows += `
        <tr class="${color}">
          <td>${data[i].id}</td>
          <td>${data[i].time_period}</td>
          <td>${predictedValue}</td>
          <td>${groundTruth || "En attente"}</td>
          <td>${isSuccess}</td>
        </tr>
      `;
    }

    return rows;
  }

  return `
    <table class="mx-auto w-100">
      <thead>
        <tr>
          <th>N°</th>
          <th>Période</th>
          <th>Prédiction</th>
          <th>Ground truth<sup>*</sup></th>
          <th>Succès/échec</th>
        <tr>
      </thead>
      <tbody>
        ${createRows(data)}
      </tbody>
    </table>
  `
}