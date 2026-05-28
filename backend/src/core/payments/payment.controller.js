const paymentService = require(
  "./payment.service.js"
);

exports.createPayment =
  async (req, res) => {
    try {
      const result =
        await paymentService.createPayment(
          {
            userId:
              req.user.id,

            itemId:
              req.body.itemId,

            itemType:
              req.body.itemType,

            title:
              req.body.title,

            amount:
              req.body.amount,
          }
        );

      res.status(201).json(
        result
      );
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  };
