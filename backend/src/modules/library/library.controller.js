const libraryService = require(
  "./library.service.js"
);

exports.createBook = async (
  req,
  res
) => {
  try {
    const book =
      await libraryService.createBook(
        req.body,
        req.files,
        req.user.id
      );

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getBooks = async (
  req,
  res
) => {
  try {
    const books =
      await libraryService.getBooks();


    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getBookById = async (
  req,
  res
) => {
  try {
    const book =
      await libraryService.getBookById(
        req.params.id
      );(error) {
    res.status(500).json({
      message: error.message,
    });

  }
}; .deleteBook = async (
  req,
  res
) => {
  try {
    await libraryService.deleteBook(
      req.params.id,
      req.user
    );
    res.json({
      message: "Book deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
