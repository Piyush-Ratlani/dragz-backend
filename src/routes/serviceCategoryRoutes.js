const express = require("express");
const serviceCategoryController = require("../controllers/serviceCategory.controller");
const router = express.Router();

router.post(
  "/service-category/add",
  serviceCategoryController.addServiceCategory_post
);
router.post(
  "/service-category/:categoryId/edit",
  serviceCategoryController.editServiceCategory_post
);
router.get(
  "/service-category/all",
  serviceCategoryController.getAllCategories_get
);
router.delete(
  "/service-category/:categoryId/delete",
  serviceCategoryController.deleteServiceCategory_delete
);

module.exports = router;
