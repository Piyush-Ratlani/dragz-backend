const mongoose = require("mongoose");
const {
  errorRes,
  successRes,
  internalServerError,
} = require("../utility/utility");
const Service = mongoose.model("Service");

module.exports.addService_post = (req, res) => {
  const {
    title,
    sub_title,
    description,
    displayImage,
    available_days,
    available_sessions,
  } = req.body;
  const { service_category } = req.params;

  if (
    !title ||
    !sub_title ||
    !description ||
    available_days?.length == 0 ||
    available_sessions?.length == 0
  )
    return errorRes(res, 400, "All fields are required.");
  if (!service_category)
    return errorRes(res, 400, "Service-Category Id is required.");

  Service.findOne({
    title: { $regex: new RegExp(title, "i") },
    service_category,
  })
    .then(savedService => {
      if (savedService) return errorRes(res, 400, "Service already exist.");

      const service = new Service({
        title,
        sub_title,
        description,
        displayImage,
        available_days,
        available_sessions,
        service_category,
      });
      service.save().then(resultServ =>
        successRes(res, {
          savedService: resultServ,
          message: "Service added successfully.",
        })
      );
    })
    .catch(err => internalServerError(res, err));
};

module.exports.deleteService_post = (req, res) => {
  const { serviceId } = req.params;

  Service.findByIdAndDelete(serviceId)
    .then(deletedService => {
      if (!deletedService) return errorRes(res, 404, "Service does not exist.");

      return successRes(res, {
        deletedService,
        message: "Service deleted successfully.",
      });
    })
    .catch(err => internalServerError(res, err));
};
