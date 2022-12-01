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
    <div id="predictions-table" class="my-2">
      <h3>Archive des prédictions passées:</h3>
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
      <p class="mt-0"><small>*<span class="italic">Ground truth</span>: Valeur faisant office de vérité observée sur le terrain; ici il s'agit du chiffre retourné par l'INSEE le trimestre suivant la prédiction.</small></p>
    </div>
  `
}