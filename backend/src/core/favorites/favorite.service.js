const Favorite = require("./favorite.model.js");

exports.addFavorite = async (
  userId,
  itemId,
  itemType
) => {
  const exists =
    await Favorite.findOne({
      user: userId,
      itemId,
      itemType,
    });

  if (exists) {
    throw new Error(
      "Already in favorites"
    );
  }

  return await Favorite.create({
    user: userId,
    itemId,
    itemType,
  });
};

exports.getFavorites = async (
  userId
) => {
  return await Favorite.find({
    user: userId,
  }).sort({ createdAt: -1 });
};

exports.removeFavorite = async (
  favoriteId,
  userId
) => {
  const favorite =
    await Favorite.findById(
      favoriteId
    );

  if (!favorite) {
    throw new Error(
      "Favorite not found"
    );
  }

  if (
    favorite.user.toString() !== userId
  ) {
    throw new Error(
      "Unauthorized"
    );
  }

  await favorite.deleteOne();

  return true;
};
