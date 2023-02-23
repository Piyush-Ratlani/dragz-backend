const express = require("express");
const serviceController = require("../controllers/service.controller");
const { requireAdminLogin } = require("../middlewares/requireLogin");
const router = express.Router();

router.post(
  "/service/:service_category/add",
  requireAdminLogin,
  serviceController.addService_post
);
router.delete(
  "/service/:serviceId/delete",
  requireAdminLogin,
  serviceController.deleteService_post
);

module.exports = router;
