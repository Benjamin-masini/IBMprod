const propertyService = require(
  "./property.service.js"
);

exports.createProperty = async (
  req,
  res
) => {
  try {
    const property =
      await propertyService.createProperty(
        req.body,
        req.files,
        req.user.id
      );

    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getProperties = async (
  req,
  res
) => {
  try {
    const properties =
      await propertyService.getProperties();

    res.json(properties);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getPropertyById = async (
  req,
  res
) => {
  try {
    const property =
      await propertyService.getPropertyById(
        req.params.id
      );

    res.json(property);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteProperty = async (
  req,
  res
) => {
  try {
    await propertyService.deleteProperty(
      req.params.id,
      req.user
    );

    res.json({
      message: "Property deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
