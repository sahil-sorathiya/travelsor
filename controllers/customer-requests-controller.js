import customerRequestModel from "../models/customer-request.js";

export const createCustomerRequest = async (req, res) => {
  try {
    const newCustomerRequest = await new customerRequestModel(req.body);
    await newCustomerRequest.save();
    res.status(200).send("Request has been sent to the agency");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getCustomerRequests = async (req, res) => {
  try {
    const customerRequests = await customerRequestModel.find({
      c_agency_id: req.params.id,
    });
    console.log(customerRequests);
    res.status(200).send(customerRequests);
  } catch (error) {
    res.status(500).send(error);
  }
};
export const deleteCustomerRequest = async (req, res) => {
  try {
    await customerRequestModel.findByIdAndDelete(req.params.id);
    res.status(200).send("Request deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};
