const adminService = require(
  "./admin.service"
);

exports.getDashboard =
  async (req, res) => {
    try {
      const stats =
        await adminService.getDashboardStats();

      res.json(stats);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.getUsers = async (
  req,
  res
) => {
  try {
    const users =
      await adminService.getUsers();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.banUser = async (
  req,
  res
) => {
  try {
    const user =
      await adminService.banUser(
        req.params.id
      );

    res.json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};