const express = require("express");

const router = express.Router();

const controller = require(
  "./payment.controller"
);

const auth = require(
  "../../middleware/auth.middleware"
);

// CREATE PAYMENT
router.post(
  "/",
  auth,
  controller.createPayment
);

module.exports = router;