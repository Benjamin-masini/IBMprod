const Property = require("./property.model");

exports.createProperty = async (
  data,
  files,
  userId
) => {
  const images = files
    ? files.map((file) => file.filename)
    : [];

  const property = await Property.create({
    ...data,
    images,
    owner: userId,
  });

  return property;
};

exports.getProperties = async () => {
  return await Property.find()
    .populate("owner", "username email")
    .sort({ createdAt: -1 });
};

exports.getPropertyById = async (id) => {
  return await Property.findById(id)
    .populate("owner", "username email");
};

exports.deleteProperty = async (
  propertyId,
  user
) => {
  const property = await Property.findById(
    propertyId
  );

  if (!property) {
    throw new Error("Property not found");
  }

  if (
    property.owner.toString() !== user.id &&
    user.role !== "admin"
  ) {
    throw new Error("Unauthorized");
  }

  await property.deleteOne();

  return true;
};