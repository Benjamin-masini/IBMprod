const Payment = require(
  "./payment.model.js"
);

const stripeProvider = require(
  "./providers/stripe.provider.js"
);

exports.createPayment =
  async ({
    userId,
    itemId,
    itemType,
    title,
    amount,
  }) => {
    // CREATE STRIPE SESSION
    const session =
      await stripeProvider.createCheckoutSession(
        {
          title,
          amount,
        }
      );

    // SAVE PAYMENT
    const payment =
      await Payment.create({
        user: userId,

        itemId,

        itemType,

        amount,

        provider: "stripe",

        status: "pending",

        transactionId:
          session.id,
      });

    return {
      payment,
      checkoutUrl:
        session.url,
    };
  };
