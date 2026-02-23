const axios = require("axios");

exports.getWaterLevelForecast = async (sourceId, historicalData) => {
  try {
    // 1. Prepare payload for your LLM
    const promptPayload = {
      model: "water-predictor-v2",
      inputs: {
        location: sourceId,
        recent_levels: historicalData,
      },
    };

    // 2. Call your External LLM
    const response = await axios.post(process.env.LLM_API_URL, promptPayload);

    // 3. Return the raw prediction data
    return response.data.forecast;
  } catch (error) {
    console.error("LLM Service Error:", error);
    throw new Error("Failed to fetch forecast");
  }
};
