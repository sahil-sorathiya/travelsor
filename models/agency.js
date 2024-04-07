import mongoose from "mongoose";

const agency = mongoose.Schema(
  {
    a_name: String,
    a_address: String,
    a_email: String,
    a_password: String,
    a_establish_date: Date,
    a_country: String,
    a_phone: String,
    a_gstnumber: String,
    a_token: String,
  },
  { timestamps: true }
);

const userModel = mongoose.model("agency", agency);
export default userModel;
