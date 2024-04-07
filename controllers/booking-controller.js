import bookingModel from "../models/booking.js";
import axios from "axios";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getBookingByAgencyId = async (req, res) => {
  try {
    const data = await bookingModel.find({
      b_travel_agency_id: req.params.id,
      b_booking_status: "booked",
    });

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
export const getCancelledBookingByAgencyId = async (req, res) => {
  try {
    const data = await bookingModel.find({
      b_travel_agency_id: req.params.id,
      b_booking_status: "cancelled",
    });

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
export const getBookingByUserId = async (req, res) => {
  try {
    const data = await bookingModel.find({ b_booked_user_id: req.params.id });

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
export const getBookingByPackageId = async (req, res) => {
  try {
    const data = await bookingModel.find({
      b_travel_package_id: req.params.id,
    });
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);

    if (session.payment_status == "paid") {
      const response = await axios.post(
        "http://localhost:8000/travelPackage/createBookedPackage",
        req.body.bookedPackage
      );
      const bookedPackageId = response.data._id;
      const agencyId = response.data.agencyId;
      const bookedPackagePrice = response.data.price;
      const booking = {
        b_travel_agency_id: agencyId,
        b_travel_package_id: bookedPackageId,
        b_booked_user_id: req.body.userId,
        b_booking_status: "booked",
        b_booking_date: new Date(),
        b_booking_cost: bookedPackagePrice,
      };

      const newBooking = await new bookingModel(booking);
      console.log("new Booking: ", await newBooking.save());
      res.status(200).send("booking done successfull");
    } else {
      res.status(200);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
export const cancelBooking = async (req, res) => {
  try {
    const booking = await bookingModel.findOneAndUpdate(
      { b_travel_package_id: req.params.id },
      { b_booking_status: "cancelled" }
    );
    res.status(200).send("Your booking has been cancelled!");
  } catch (error) {
    res.status(500).send(error);
  }
};
export const getTravelHistoryByUserId = async (req, res) => {
  try {
    const travelHistory = await bookingModel.find({
      b_booked_user_id: req.params.id,
      b_booking_status: "completed",
    });
    res.status(200).send(travelHistory);
  } catch (error) {
    res.status(500).send(error);
  }
};
