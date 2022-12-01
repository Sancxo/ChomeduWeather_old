import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function savePrediction(prediction, timePeriod) {
  try {
    const entity = {
      time_period: timePeriod,
      predicted_value: prediction
    }

    const resp = await supabase.from('predictions').upsert(entity, { onConflict: "time_period" });
    const { data, error } = resp;

    // console.log(resp)

    if (error) throw error
    else if (data) console.info(`Prediction ${prediction} registered in DB for ${timePeriod} with id ${data.id}`)
  } catch (error) {
    console.error(error);
  }
}

async function saveGroundTruth(timePeriod, value) {
  try {
    const entity = {
      time_period: timePeriod,
      ground_truth: value
    }
    const { data, error } = await supabase.from('predictions').upsert(entity, { onConflict: "time_period" });

    if (error) throw error;
    else if (data) console.info(`Ground truth for ${timePeriod} has been set with value ${value}`);
  } catch (error) {

  }
}

async function getAllPredictions() {
  try {
    const { data, error } = await supabase.from('predictions').select("*");

    if (error) throw error;
    else return data;
  } catch (error) {
    console.error(error);
  }
}

export { savePrediction, getAllPredictions, saveGroundTruth };