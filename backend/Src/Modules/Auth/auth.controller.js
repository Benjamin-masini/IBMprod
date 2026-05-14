const authService = require("./auth.service");

exports.login = async (req, res) => {
  try {
    const data = await authService.login(
      req.body.email,
      req.body.password
    );

    res.json(data);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
