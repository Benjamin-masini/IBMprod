const favoriteService = require(
  "./favorite.service"
);

exports.addFavorite = async (
  req,
  res
) => {
  try {
    const favorite =
      await favoriteService.addFavorite(
        req.user.id,
        req.body.itemId,
        req.body.itemType
      );

    res.status(201).json(favorite);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getFavorites = async (
  req,
  res
) => {
  try {
    const favorites =
      await favoriteService.getFavorites(
        req.user.id
      );

    res.json(favorites);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.removeFavorite = async (
  req,
  res
) => {
  try {
    await favoriteService.removeFavorite(
      req.params.id,
      req.user.id
    );

    res.json({
      message:
        "Favorite removed",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};