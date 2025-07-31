import order from "../../models/order.js";
import Order from "../../models/order.js";
import Product from "../../models/product.js";
import Stripe from "stripe";
import User from "../../models/User.js";

// Initialize Stripe with your secret key

/* ---------------------------------------------------------
   1. PLACE ORDER - CASH ON DELIVERY (COD)
   Endpoint: POST /api/order/cod
---------------------------------------------------------- */
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address } = req.body;

    // Validate input
    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    // Calculate total amount (sum of product price * quantity)
    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      amount += product.offerPrice * item.quantity;
    }

    // Add 2% tax
    amount += Math.floor(amount * 0.02);

    // Save order to database
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
      isPaid: false,
    });

    return res.json({ success: true, message: "Order created successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

/* ---------------------------------------------------------
   2. PLACE ORDER - STRIPE PAYMENT
   Endpoint: POST /api/order/stripe
---------------------------------------------------------- */
export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address } = req.body;
    const origin = req.headers.origin;

    // Validate input
    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    const productData = [];
    let amount = 0;

    // Loop through each item, fetch product info, and prepare Stripe data
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      const itemTotal = product.offerPrice * item.quantity;
      amount += itemTotal;

      productData.push({
        name: product.name,
        quantity: item.quantity,
        unitPrice: Math.floor(product.offerPrice * 1.02 * 100), // price in cents with 2% tax
      });
    }

    // Save order to DB first with isPaid: false
    const newOrder = await Order.create({
      userId,
      items,
      amount: Math.floor(amount * 1.02),
      address,
      paymentType: "Online",
      isPaid: false,
    });

    //initialize stripe gateway
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Create line items for Stripe
    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.unitPrice, // in cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: newOrder._id.toString(),
        userId: userId,
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Stripe webhooks to verify payments Action: /Stripe

export const stripeWebHooks = async (request, response) => {
  //stripe gateway initialize
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];
  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    response.status(400).send(`webhook Error: ${error.message}`);
  }

  //handle event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      //getting session metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { orderId, userId } = session.data[0].metadata;
      //mark payment as paid
      await Order.findByIdAndUpdate(orderId, { isPaid: true });

      //clear user cart
      await User.findByIdAndUpdate(userId, {});
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      //getting session metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { orderId } = session.data[0].metadata;
      await Order.findByIdAndDelete(orderId);
      break;
    }

    default:
      console.error(`unhandled event type ${event.type}`);
      break;
  }
  response.json({ received: true });
};

/* ---------------------------------------------------------
   3. GET USER ORDERS
   Endpoint: POST /api/order/user
---------------------------------------------------------- */
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

/* ---------------------------------------------------------
   4. GET ALL ORDERS (Admin/Seller)
   Endpoint: GET /api/order/seller
---------------------------------------------------------- */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .populate("address");

    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
