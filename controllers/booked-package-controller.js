import bookedPackageModel from "../models/booked-package.js";

export const getBookedPackageById = async (req, res) => {
  try {
    const bookedPackage = await bookedPackageModel.findById(req.params.id);
    res.status(200).send(bookedPackage);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const createBookingPackage = async (req, res) => {
  try {
    req.body._id = undefined;
    const newBookedPackage = await new bookedPackageModel(req.body);
    const bookedPackage = await newBookedPackage.save();
    res.status(200).send({
      _id: bookedPackage._id,
      agencyId: bookedPackage.p_agency_id,
      price: bookedPackage.p_total_cost,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
