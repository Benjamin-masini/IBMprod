const marketplaceService = require(
  "./marketplace.service.js"
);

exports.createItem = async (
  req,
  res
) => {
  try {
    const item =
      await marketplaceService.createItem(
        req.body,
        req.files,
        req.user.id
      );

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getItems = async (
  req,
  res
) => {
  try {
    const items =
      await marketplaceService.getItems();

    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getItemById = async (
  req,
  res
) => {
  try {
    const item =
      await marketplaceService.getItemById(
        req.params.id
      );

    res.json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteItem = async (
  req,
  res
) => {
  try {
    await marketplaceService.deleteItem(
      req.params.id,
      req.user
    );

    res.json({
      message: "Item deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
