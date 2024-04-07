import mongoose from "mongoose";

const userOtpSchema = mongoose.Schema(
  {
    userId: String,
    otp: String,
    expiry: Date,
  },
  {
    timestamps: true,
  }
);

const userOtpModel = mongoose.model("userOtp", userOtpSchema);
export default userOtpModel;
