const Library = require("./library.model");

exports.createBook = async (
  data,
  files,
  userId
) => {
  return await Library.create({
    ...data,

    coverImage:
      files.coverImage
        ? files.coverImage[0].filename
        : null,
    pdfFile:
      files.pdfFile[0].filename,

    uploadedBy: userId,
  });
};

exports.getBooks = async () => {
  return await Library.find()
    .populate(
      "uploadedBy",
      "username email"
    )
    .sort({ createdAt: -1 });
};

exports.getBookById = async (id) => {
  return await Library.findById(id)
    .populate(
      "uploadedBy",
      "username email"
    );
};

exports.deleteBook = async (
  bookId,
  user
) => {
  const book = await Library.findById(
    bookId
  );

  if (!book) {
    throw new Error("Book not found");
  }

  if (
    book.uploadedBy.toString() !== user.id &&
    user.role !== "admin"
  ) {
    throw new Error("Unauthorized");
  }

  await book.deleteOne();

  return true;
};