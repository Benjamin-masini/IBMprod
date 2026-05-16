const Property = require(
  "../../modules/property/property.model"
);

const Marketplace = require(
  "../../modules/marketplace/marketplace.model"
);

const Library = require(
  "../../modules/library/library.model"
);

const Event = require(
  "../../modules/event/event.model"
);


exports.globalSearch = async (
  query
) => {
  const regex = new RegExp(
    query,
    "i"
  );

  // PROPERTY
  const properties =
    await Property.find({
      $or: [
        { title: regex },
        { description: regex },
      ],
    }).limit(5);

  // MARKETPLACE
  const marketplace =
    await Marketplace.find({
      $or: [
        { title: regex },
        { description: regex },
      ],
    }).limit(5);

  // LIBRARY
  const library =
    await Library.find({
      $or: [
        { title: regex },
        { description: regex },
        { author: regex },
      ],
    }).limit(5);

  // EVENTS
  const events =
    await Event.find({
      $or: [
        { title: regex },
        { description: regex },
        { location: regex },
      ],
    }).limit(5);

  return {
    properties,
    marketplace,
    library,
    events,
  };
};