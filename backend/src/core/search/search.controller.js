const searchService = require(
  "./search.service.js"
);

exports.globalSearch = async (
  req,
  res
) => {
  try {
    const results =
      await searchService.globalSearch(
        req.query.q
      );

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
