import { values } from "../shared/helpers/api.helper";
import { savePrediction } from "../shared/helpers/supabase.helper";

export default function perceptron(nextQuarter, currentOrNextYear) {
  function predict(data) {
    let weight = 0.1;
    const alpha = 0.001;
    let finalPrediction;

    const neural_network = (data, weight) => {
      return data * weight;
    }

    const error = (prediction, trueValue) => {
      return (prediction - trueValue) ** 2;
    }

    for (let i = 1; i <= 100; i++) {
      const currentErrors = [];
      for (let j = 0; j < data.length; j++) {
        const prediction = neural_network(data[j], weight);
        let currentError;
        if (data[j + 1]) {
          currentError = error(prediction, data[j + 1]);
          currentErrors.push(currentError);

          const errorPrime = (data[j] * weight - data[j + 1]) * data[j];

          weight -= alpha * errorPrime;
        } else {
          currentErrors.push("Last iteration reached.");
          finalPrediction = prediction;
        }
        // console.log(`Train n° ${i}, iteration ${j}: error is ${currentErrors[j]} and prediction is ${prediction}`)
      }
      // console.info(`Train n°${i} terminated with prediction at ${finalPrediction}, last error measurement was ${currentErrors[currentErrors.length - 2]}`)
    }

    return finalPrediction.toFixed(1);
  }

  const currentPrediction = predict(values);
  const diff = (currentPrediction - values[values.length - 1]).toFixed(1);
  const condition = currentPrediction < 9 && diff < 0.8 ? true : false;
  const nextTimePeriod = `${currentOrNextYear}-${nextQuarter}`;

  savePrediction(currentPrediction, nextTimePeriod);

  return `
    <div>
      <p class="mb-0 bold ${condition ? "danger" : "success"}">Prédiction pour le trimestre prochain (${nextTimePeriod}): ${currentPrediction} (${diff})</p>
      <p class="mt-0 italic"><sub>N.B.: cet indice prévisionnel est calculé par le présent site avec un réseau de neurones simple (perceptron), entrainé partir des chiffres trimestriels du chômage de 1975 à nos jours tels qu'établis par l'INSEE. Cet indice est totalement hypothétique, peut ne pas refléter la réalité du prochain trimestre et ne dépend pas de l'INSEE.</sub></p>
    </div>
  `
}