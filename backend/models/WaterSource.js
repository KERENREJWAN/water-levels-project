const mongoose = require("mongoose");

const WaterSourceSchema = new mongoose.Schema({
  // Unique identifier
  slug: { type: String, required: true, unique: true, lowercase: true },

  // Display Information
  name: { type: String, required: true },

  // Geographic Information (for the Map)
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true }, // [Longitude, Latitude]
  },
  regions: [String],

  // Operational Thresholds (Units in meters)
  thresholds: {
    maxCapacity: { type: Number, required: true }, // The "Full" level
    warningLevel: { type: Number }, // Yellow status threshold
    criticalLevel: { type: Number }, // Red status threshold
  },
  // yearlyHistory: [
  //   {
  //     month: Number,
  //     year: Number,
  //     avg: Number,
  //   },
  // ],
});

module.exports = mongoose.model("WaterSource", WaterSourceSchema);
