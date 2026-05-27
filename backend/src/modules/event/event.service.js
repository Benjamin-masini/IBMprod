const Event = require("./event.model.js");

exports.createEvent = async (
  data,
  files,
  userId
) => {
  const images = files
    ? files.map((file) => file.filename)
    : [];

  return await Event.create({
    ...data,
    images,
    organizer: userId,
  });
};

exports.getEvents = async () => {
  return await Event.find()
    .populate(
      "organizer",
      "username email"
    )
    .sort({ createdAt: -1 });
};

exports.getEventById = async (id) => {
  return await Event.findById(id)
    .populate(
      "organizer",
      "username email"
    );
};

exports.deleteEvent = async (
  eventId,
  user
) => {
  const event = await Event.findById(
    eventId
  );

  if (!event) {
    throw new Error(
      "Event not found"
    );
  }

  if (
    event.organizer.toString() !==
      user.id &&
    user.role !== "admin"
  ) {
    throw new Error(
      "Unauthorized"
    );
  }

  await event.deleteOne();

  return true;
};
