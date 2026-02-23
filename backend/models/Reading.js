const mongoose = require("mongoose");

const ReadingSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true },
    metadata: {
      sourceId: { type: String }, // Links to WaterSource slug (if level)
      region: { type: String }, // e.g., 'Golan Heights' (if rainfall)
      type: { type: String, enum: ["water_level", "rainfall"] },
    },
    value: { type: Number, required: true },
  },
  {
    timeseries: {
      timeField: "timestamp",
      metaField: "metadata",
      granularity: "hours",
    },
  },
);

// // Static method to get the latest reading for a specific source
// ReadingSchema.statics.getLatest = function (sourceId) {
//   return this.findOne({ "metadata.sourceId": sourceId }).sort({
//     timestamp: -1,
//   });
// };

module.exports = mongoose.model("Reading", ReadingSchema);
