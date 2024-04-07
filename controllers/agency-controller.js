import agencyModel from "../models/agency.js";
import { alreadyRegisteredAgency } from "../util/validation.js";
import { generateJWTToken, verifyJWTToken } from "../util/authentication.js";
export const registerAgency = async (req, res) => {
  try {
    const agency = req.body;

    if (await alreadyRegisteredAgency(agency.a_email)) {
      return res.send("Agency already registered");
    }
    const newUser = await new agencyModel(agency);
    newUser.save();
    res.status(200).send("Agency registered successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const loginAgency = async (req, res) => {
  try {
    if (await alreadyRegisteredAgency(req.body.email)) {
      const token = generateJWTToken({
        email: req.body.email,
        date: new Date(),
      });

      await agencyModel.findOneAndUpdate(
        {
          a_email: req.body.email,
          a_password: req.body.password,
        },
        { a_token: token }
      );
      res.status(200).send(token);
    } else {
      res.status(401).send("The Account does not exist.");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
export const logoutAgency = async (req, res) => {
  try {
    await agencyModel.updateOne(
      { a_email: req.body.a_email },
      { a_token: null }
    );
    res.status(200).send("Agency logged out successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};
export const updateAgency = async (req, res) => {
  try {
    await agencyModel.findOneAndUpdate({ a_email: req.body.a_email }, req.body);
    res.status(200).send("Agency updated successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};
export const getAgencyProfile = async (req, res) => {
  try {
    const token = req.headers["admin-token"];
    if (token) {
      const email = verifyJWTToken(token);
      if (email) {
        const data = await agencyModel.findOne({ a_email: email });
        data.a_token = undefined;
        res.status(200).send(data);
      } else {
        res.status(404).send(undefined);
      }
    } else {
      res.status(404).send(undefined);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
export const getAgency = async (req, res) => {
  try {
    const data = await agencyModel.findById(req.params.id);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
export const getAllAgencies = async (req, res) => {
  try {
    const data = await agencyModel.find();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getPhoneNumberById = async (req, res) => {
  try {
    const { a_phone } = await agencyModel.findById(req.params.id);
    res.status(200).send({ phone: a_phone });
  } catch (error) {
    res.status(500).send(error);
  }
};
