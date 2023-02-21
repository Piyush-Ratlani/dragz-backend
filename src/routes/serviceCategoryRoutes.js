const express = require('express');
const serviceCategoryController = require('../controllers/serviceCategoryController');
const router = express.Router();

router.post(
  '/service-category/add',
  serviceCategoryController.addServiceCategory_post
);
router.get(
  '/service-category/all',
  serviceCategoryController.getAllCategories_get
);
router.delete(
  '/service-category/:categoryId/delete',
  serviceCategoryController.deleteServiceCategory_delete
);

module.exports = router;
