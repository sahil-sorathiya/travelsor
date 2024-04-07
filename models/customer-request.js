import mongoose from "mongoose";

const customerRequest = mongoose.Schema(
  {
    c_agency_id: String,
    c_name: String,
    c_email: String,
    c_phone: String,
    c_message: String,
  },
  { timestamps: true }
);

const customerRequestModel = mongoose.model(
  "customer_request",
  customerRequest
);
export default customerRequestModel;
