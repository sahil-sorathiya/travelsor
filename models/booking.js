import mongoose from "mongoose";

const booking = mongoose.Schema(
  {
    b_travel_agency_id: String,
    b_travel_package_id: String,
    b_booked_user_id: String,
    b_booking_status: String,
    b_booking_date: Date,
    b_booking_cost: Number,
  },
  { timestamps: true }
);

const bookingModel = mongoose.model("booking", booking);

export default bookingModel;
