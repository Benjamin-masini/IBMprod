const eventService = require(
  "./event.service.js"
);

exports.createEvent = async (
  req,
  res
) => {
  try {
    const event =
      await eventService.createEvent(
        req.body,
        req.files,
        req.user.id
      );

    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getEvents = async (
  req,
  res
) => {
  try {
    const events =
      await eventService.getEvents();

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getEventById = async (
  req,
  res
) => {
  try {
    const event =
      await eventService.getEventById(
        req.params.id
      );

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteEvent = async (
  req,
  res
) => {
  try {
    await eventService.deleteEvent(
      req.params.id,
      req.user
    );

    res.json({
      message: "Event deleted",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
