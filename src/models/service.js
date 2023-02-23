const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const serviceSchema = mongoose.Schema({
  service_category: {
    type: ObjectId,
    ref: "ServiceCategory",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  sub_title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  displayImage: {
    url: {
      type: String,
      required: true,
      default:
        "https://assets-news.housing.com/news/wp-content/uploads/2020/10/04110325/Why-you-should-you-hire-professional-cleaning-services-while-moving-out-FB-1200x700-compressed.jpg",
    },
  },
  available_days: [
    {
      day: {
        type: String,
        required: true,
        enum: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      },
      active: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],
  available_sessions: [
    {
      timing: {
        type: String,
        required: true,
        enum: [
          "Morning 8 AM - 12 PM",
          "Afternoon 12 PM - 4 PM",
          "Evening 4 PM - 8 PM",
        ],
      },
      active: { type: Boolean, required: true, default: false },
    },
  ],
});

mongoose.model("Service", serviceSchema);
