const mongoose = require("mongoose");

const ForecastSchema = new mongoose.Schema({
  // we want to save it uniquely by date and not by source
  sourceId: { type: String, required: true, index: true },
  generatedAt: { type: Date, default: Date.now },
  modelVersion: { type: String, default: "v2.3.1" },
  dayPrediction: {
    date: Date,
    level: Number,
    confidence: Number,
  },
  nextWeekPredicion: {
    date: Date,
    level: Number,
    confidence: Number,
  },
  twoWeeksPredicion: {
    date: Date,
    level: Number,
    confidence: Number,
  },
  oneMonthPrediction: {
    date: Date,
    level: Number,
    confidence: Number,
  },
  regionImpacts: [
    {
      regionName: String,
      currentWeight: Number,
    },
  ],
});

module.exports = mongoose.model("Forecast", ForecastSchema);
