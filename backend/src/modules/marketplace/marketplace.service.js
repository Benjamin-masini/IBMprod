const Marketplace = require("./marketplace.model.js");

exports.createItem = async (
  data,
  files,
  userId
) => {
  const images = files
    ? files.map((file) => file.filename)
    : [];

  return await Marketplace.create({
    ...data,
    images,
    seller: userId,
  });
};

exports.getItems = async () => {
  return await Marketplace.find()
    .populate("seller", "username email")
    .sort({ createdAt: -1 });
};

exports.getItemById = async (id) => {
  return await Marketplace.findById(id)
    .populate("seller", "username email");
};

exports.deleteItem = async (
  itemId,
  user
) => {
  const item = await Marketplace.findById(
    itemId
  );

  if (!item) {
    throw new Error("Item not found");
  }

  if (
    item.seller.toString() !== user.id &&
    user.role !== "admin"
  ) {
    throw new Error("Unauthorized");
  }

  await item.deleteOne();

  return true;
};
