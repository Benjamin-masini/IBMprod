const express = require("express");

const router = express.Router();

const controller = require(
  "./library.controller"
);

const auth = require(
  "../../middleware/auth.middleware"
);

const role = require(
  "../../middleware/role.middleware"
);

const upload = require(
  "../../middleware/upload.middleware"
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