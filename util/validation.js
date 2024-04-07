import userModel from "../models/user.js";
import agencyModel from "../models/agency.js";
export const alreadyRegistered = async (email) => {
  let exist = await userModel.findOne({ u_email: email });
  if (exist) {
    return true;
  }
  return false;
};
export const alreadyRegisteredAgency = async (email) => {
  let exist = await agencyModel.findOne({ a_email: email });
  console.log(exist);
  if (exist) {
    return true;
  }
  return false;
};
