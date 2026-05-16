const Stripe = require("stripe");

const stripe = Stripe(
  process.env.STRIPE_SECRET_KEY
);

exports.createCheckoutSession =
  async ({
    title,
    amount,
  }) => {
    const session =
      await stripe.checkout.sessions.create(
        {
          payment_method_types: [
            "card",
          ],

          line_items: [
            {
              price_data: {
                currency: "usd",

                product_data: {
                  name: title,
                },

                unit_amount:
                  amount * 100,
              },

              quantity: 1,
            },
          ],

          mode: "payment",

          success_url:
            "http://localhost:3000/success",

          cancel_url:
            "http://localhost:3000/cancel",
        }
      );

    return session;
  };