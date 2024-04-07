import { config } from "dotenv";
config();

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const makePayment = async (req, res) => {
  try {
    const session = await stripePaymentGateway(req.body);
    res.status(200).send({ url: session.url, id: session.id });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const stripePaymentGateway = async (product) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.p_name,
          },
          unit_amount:
            (product.p_price.total_cost - product.p_price.discount) * 100,
        },
        quantity: product.p_guests.length,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:3000/success`,
    cancel_url: "http://localhost:3000/cancel",
  });

  return session;
};
