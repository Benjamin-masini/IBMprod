const User = require(
  "../../modules/user/user.model"
);

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

const Payment = require(
  "../payments/payment.model"
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