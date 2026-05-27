const express = require("express");

const router = express.Router();

const controller = require(
  "./library.controller.js"
);

const auth = require(
  "../../middleware/auth.middleware.js"
);

const role = require(
  "../../middleware/role.middleware.js"
);

const upload = require(
  "../../middleware/upload.middleware.js"
);

// GET ALL BOOKS
router.get(
  "/",
  controller.getBooks
);
// GET ONE BOOK
router.get(
  "/:id",
  controller.getBookById
);

// CREATE BOOK
router.post(
  "/",
  auth,
  role(["seller", "admin"]),
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "pdfFile",
      maxCount: 1,
    },
  ]),
  controller.createBook
);

// DELETE BOOK
router.delete(
  "/:id",
  auth,
  controller.deleteBook
);

module.exports = router;
