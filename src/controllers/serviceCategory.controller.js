const mongoose = require("mongoose");
const { errorRes, internalServerError } = require("../utility/utility");
const { successRes } = require("../utility/utility");
const ServiceCategory = mongoose.model("ServiceCategory");

module.exports.addServiceCategory_post = async (req, res) => {
  const { name, displayImage, position } = req.body;

  if (!name || !position) {
    return errorRes(res, 400, "All fields are required.");
  }

  const serviceCategoryCount = await ServiceCategory.countDocuments();
  if (position <= 0)
    return errorRes(
      res,
      400,
      "Service-Category's position should be greater than 0."
    );
  else if (position > serviceCategoryCount + 1)
    return errorRes(
      res,
      400,
      `Service-Category's position cannot be greater than ${
        serviceCategoryCount + 1
      }.`
    );

  ServiceCategory.findOne({ name: { $regex: new RegExp(name, "i") } })
    .then(async savedCategory => {
      if (savedCategory)
        return errorRes(res, 400, "Given category name already exist");
      else {
        const serviceCategory = new ServiceCategory({
          name,
          displayImage,
          position,
        });

        try {
          const categoriesToUpdate = await ServiceCategory.find({
            position: { $gte: serviceCategory.position },
          });

          await Promise.all(
            categoriesToUpdate.map(async category => {
              category.position++;
              await category.save();
            })
          );

          await serviceCategory
            .save()
            .then(category => {
              const { _id, name, displayImage, position } = category;
              return successRes(res, {
                serviceCategory: { _id, name, displayImage, position },
                message: "Service category added successfully.",
              });
            })
            .catch(err => internalServerError(res, err));
        } catch (error) {
          internalServerError(res, error);
        }
      }
    })
    .catch(err => internalServerError(res, err));
};

module.exports.editServiceCategory_post = async (req, res) => {
  const { name, position } = req.body;
  const { categoryId } = req.params;
  const category = await ServiceCategory.findById(categoryId);
  const oldPosition = category.position;
  const newPosition = position;
  const serviceCategoryCount = await ServiceCategory.countDocuments();

  if (!name || !position) return errorRes(res, 400, "Invalid request.");
  if (!category) return errorRes(res, 404, "Service category does not exist");

  if (position <= 0)
    return errorRes(
      res,
      400,
      "Service-Category's position should be greater than 0."
    );
  else if (position > serviceCategoryCount)
    return errorRes(
      res,
      400,
      `Service-Category's position cannot be greater than ${serviceCategoryCount}.`
    );

  // if (newPosition = oldPosition){
  //   category.name = name
  //   await category.save()
  //   .then(updatedCategory => {
  //    const {_id, name, displayImage, position} = updatedCategory
  //    return successRes(res, {updatedCategory: {_id, name, displayImage, position}, message: "Service category updated successfully."})
  //   })
  // }else
  if (newPosition > oldPosition) {
    const categoriesToUpdate = await ServiceCategory.find({
      position: { $gt: oldPosition, $lte: newPosition },
    });
    await Promise.all(
      categoriesToUpdate.map(async category => {
        category.position--;
        await category.save();
      })
    );
  } else if (newPosition < oldPosition) {
    const categoriesToUpdate = await ServiceCategory.find({
      position: { $gte: newPosition, $lt: oldPosition },
    });
    await Promise.all(
      categoriesToUpdate.map(async category => {
        category.position++;
        await category.save();
      })
    );
  }

  category.name = name;
  category.position = position;
  await category.save().then(updatedCategory => {
    const { _id, name, displayImage, position } = updatedCategory;
    return successRes(res, {
      updatedCategory: { _id, name, displayImage, position },
      message: "Service category updated successfully.",
    });
  });

  // ServiceCategory.findByIdAndUpdate(categoryId, updates, { new: true })
  //   .then(updatedCategory => {
  //     if (!updatedCategory)
  //       return errorRes(res, 400, "Category does not exist.");
  //     else
  //       return successRes(res, {
  //         updatedCategory,
  //         message: "Category updated successfully.",
  //       });
  //   })
  //   .catch(err => internalServerError(res, err));
};

module.exports.deleteServiceCategory_delete = async (req, res) => {
  const { categoryId } = req.params;

  ServiceCategory.findOneAndDelete({ _id: categoryId })
    .then(async deletedCategory => {
      if (!deletedCategory)
        return errorRes(res, 404, "Given category-id does not exist.");
      else {
        const deletedPosition = deletedCategory.position;
        await ServiceCategory.updateMany(
          { position: { $gt: deletedPosition } },
          { $inc: { position: -1 } }
        )
          .then(result => {
            if (result)
              return successRes(res, {
                deletedCategory,
                message: "Service-Category deleted successfully.",
              });
            else return internalServerError(res, err);
          })
          .catch(err => internalServerError(res, err));
      }
    })
    .catch(err => internalServerError(res, err));
};

module.exports.getAllCategories_get = (req, res) => {
  ServiceCategory.find()
    .select("-__v")
    .sort({ position: 1 })
    .then(serviceCategories => {
      return successRes(res, { serviceCategories });
    })
    .catch(err => internalServerError(res, err));
};
