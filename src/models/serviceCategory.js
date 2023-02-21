const mongoose = require('mongoose');

const serviceCategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  displayImage: {
    url: {
      type: String,
      default:
        'https://icons.veryicon.com/png/o/application/a1/default-application.png',
      required: true,
    },
  },
  position: {
    type: Number,
    required: true,
  },
});

mongoose.model('ServiceCategory', serviceCategorySchema);
