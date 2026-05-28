const User = require(
  "../../modules/user/user.model.js"
);

const Property = require(
  "../../modules/property/property.model.js"
);

const Marketplace = require(
  "../../modules/marketplace/marketplace.model.js"
);

const Library = require(
  "../../modules/library/library.model.js"
);

const Event = require(
  "../../modules/event/event.model.js"
);

const Payment = require(
  "../payments/payment.model.js"
);

exports.getDashboardStats =
  async () => {
    const users =
      await User.countDocuments();

    const properties =
      await Property.countDocuments();

    const marketplace =
      await Marketplace.countDocuments();

    const library =
      await Library.countDocuments();

    const events =
      await Event.countDocuments();

    const payments =
      await Payment.countDocuments();

    const revenue =
      await Payment.aggregate([
        {
          $match: {
            status: "completed",
          },
        },

        {
          $group: {
            _id: null,

            total: {
              $sum: "$amount",
            },
          },
        },
      ]);

    return {
      users,

      properties,

      marketplace,

      library,

      events,

      payments,

      revenue:
        revenue[0]?.total || 0,
    };
  };

  exports.getUsers = async () => {
  return await User.find()
    .select("-password")
    .sort({ createdAt: -1 });
};

exports.banUser = async (
  userId
) => {
  return await User.findByIdAndUpdate(
    userId,

    {
      isBanned: true,
    },

    {
      new: true,
    }
  );
};
