const Forecast = require("../models/Forecast");
const llmService = require("../services/llmService");
const Reading = require("../models/Reading");

exports.getForecasts = async (req, res) => {
  const { sourceId } = req.params;

  // 1. Check MongoDB for a fresh forecast (e.g., generated < 24 hours ago)
  const sixHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  let forecast = await Forecast.findOne({
    sourceId,
    generatedAt: { $gt: sixHoursAgo },
  });

  if (forecast) {
    return res.json(forecast); // Return cached data
  }

  // 2. If no cache, fetch recent readings to help the LLM
  const recentReadings = await Reading.find({ sourceId })
    .sort({ date: -1 })
    .limit(30);

  // 3. Call the LLM Service
  const newPredictions = await llmService.getWaterLevelForecast(
    sourceId,
    recentReadings,
  );

  // 4. Save to MongoDB for next time
  forecast = await Forecast.create({
    sourceId,
    predictions: newPredictions,
  });

  return res.json(forecast);
};
