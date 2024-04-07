import travelPackageModel from "../models/travel-package.js";
import cloudinary from "cloudinary";
import axios from "axios";
import fs from "fs";
import { config } from "dotenv";
import { recommendationModel } from "../algorithm/recommendation.js";
config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export const createTravelPackage = async (req, res) => {
  try {
    const localPath = "./uploads/";
    const imagePreview = await cloudinary.v2.uploader
      .upload(localPath + req.files[0].filename)
      .then((result) => {
        fs.unlinkSync("uploads/" + req.files[0].filename);
        return result.url;
      });

    const images = [];
    for (let i = 1; i < req.files.length; i++) {
      await cloudinary.v2.uploader
        .upload(localPath + req.files[i].filename)
        .then((result) => {
          images.push(result.url);
          fs.unlinkSync("uploads/" + req.files[i].filename);
        });
    }

    const activitiesCost = req.body.p_days_plan
      ? JSON.parse(req.body.p_days_plan).reduce(
          (sum, value) => sum + Number(value.price),
          0
        )
      : 0;

    const totalCost =
      Number(req.body.p_price) +
      Number(JSON.parse(req.body.p_hotel).price_per_room) +
      Number(JSON.parse(req.body.p_flight).price) +
      Number(JSON.parse(req.body.p_return_flight).price) +
      Number(JSON.parse(req.body.p_transport).price) +
      activitiesCost;
    const data = {
      p_agency_id: req.body.p_agency_id,
      p_name: req.body.p_name,
      p_start_location: "Ahmedabad",
      p_destination: req.body.p_destination,
      p_days: req.body.p_days,
      p_description: req.body.p_description,
      p_price: {
        base_price: Number(req.body.p_price),
        discount: (Number(totalCost) * Number(req.body.p_discount)) / 100,
        percentage: Number(req.body.p_discount),
        total_cost: totalCost,
      },
      p_start_date: req.body.p_start_date,
      p_imagePreview: imagePreview,
      p_images: images,

      p_days_plan: req.body.p_days_plan ? JSON.parse(req.body.p_days_plan) : [],
      p_policies: {
        cancellation: {
          from: req.body.p_start_date,
          to: req.body.p_refund_date,
          description: req.body.p_refund_desc,
        },
      },
      p_flight: JSON.parse(req.body.p_flight),
      p_return_flight: JSON.parse(req.body.p_return_flight),
      p_transport: JSON.parse(req.body.p_transport),
      p_hotel: JSON.parse(req.body.p_hotel),
      p_keywords: req.body.p_keywords.split(","),
    };

    const travelPackage = await new travelPackageModel(data);

    await travelPackage.save();
    res.status(200).send("Package created successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getAllTravelPackages = async (req, res) => {
  try {
    const travelPackages = await travelPackageModel.find({
      p_agency_id: req.params.agencyId,
    });
    res.status(200).send(travelPackages);
  } catch (error) {
    res.status(500).send(error);
  }
};
export const getTravelPackageById = async (req, res) => {
  try {
    const travelPackage = await travelPackageModel.findById(req.params.id);
    res.status(200).send(travelPackage);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteTravelPackageById = async (req, res) => {
  try {
    await travelPackageModel.findByIdAndDelete(req.params.id);
    res.status(200).send("Package deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getRecentlyAddedTravelPackages = async (req, res) => {
  try {
    const recentTravelPackages = await travelPackageModel
      .find({
        p_start_date: { $lt: new Date(req.body.date).getTime() },
      })
      .limit(7);
    res.status(200).send(recentTravelPackages);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getTravelPackagesByDestination = async (req, res) => {
  try {
    const travelPackagesByDestination = await travelPackageModel.find({
      p_destination: req.params.destination,
    });
    res.status(200).send(travelPackagesByDestination);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getSpecialOfferPackages = async (req, res) => {
  try {
    const specialOfferPackages = await travelPackageModel
      .find({
        "p_price.percentage": {
          $gt: Number(req.params.discount),
        },
      })
      .limit(7);

    res.status(200).send(specialOfferPackages);
  } catch (error) {
    res.status(500).send(error);
  }
};
export const getPackageRecommendation = async (req, res) => {
  try {
    const userHistoryResponse = await axios.get(
      `http://localhost:8000/travelPackage/getTravelHistory/${req.params.id}`
    );
    if (userHistoryResponse.data.length > 0) {
      const userHistoryPackages = [];

      for (let item of userHistoryResponse.data) {
        const completedTripPackage = await axios.get(
          "http://localhost:8000/travelPackage/getBookedPackage/" +
            item.b_travel_package_id
        );
        userHistoryPackages.push(completedTripPackage.data);
      }
      const allPackages = await travelPackageModel.find();
      const recommendedPackages = recommendationModel(
        allPackages,
        userHistoryPackages
      );

      if (recommendedPackages.length >= 2) {
        res.status(200).send(recommendedPackages);
      }
    } else {
      res.status(200).send([]);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateTravelPackage = async (req, res) => {
  try {
    let imagePreview = "";
    if (req.files.length > 0 && req.files[0].fieldname == "p_imagePreview") {
      const localPath = "./uploads/";
      imagePreview = await cloudinary.v2.uploader
        .upload(localPath + req.files[0].filename)
        .then((result) => {
          fs.unlinkSync("uploads/" + req.files[0].filename);
          return result.url;
        });
    }

    const images = [];
    if (req.files.length > 0 && req.files[0].fieldname == "p_images") {
      for (let i = 1; i < req.files.length; i++) {
        await cloudinary.v2.uploader
          .upload(localPath + req.files[i].filename)
          .then((result) => {
            fs.unlinkSync("uploads/" + req.files[0].filename);
            images.push(result.url);
          });
      }
    }

    const activitiesCost = req.body.p_days_plan
      ? JSON.parse(req.body.p_days_plan).reduce(
          (sum, value) => sum + Number(value.price),
          0
        )
      : 0;

    const totalCost =
      Number(req.body.p_price) +
      Number(JSON.parse(req.body.p_hotel).price_per_room) +
      Number(JSON.parse(req.body.p_flight).price) +
      Number(JSON.parse(req.body.p_return_flight).price) +
      Number(JSON.parse(req.body.p_transport).price) +
      activitiesCost;

    const data = {
      p_agency_id: req.body.p_agency_id,
      p_name: req.body.p_name,
      p_start_location: "Ahmedabad",
      p_destination: req.body.p_destination,
      p_days: req.body.p_days,
      p_description: req.body.p_description,
      p_price: {
        base_price: Number(req.body.p_price),
        discount: (Number(totalCost) * Number(req.body.p_discount)) / 100,
        percentage: Number(req.body.p_discount),
        total_cost: totalCost,
      },
      p_start_date: req.body.p_start_date,
      p_imagePreview:
        imagePreview == "" ? req.body.p_defaultImagePreview : imagePreview,
      p_images:
        images.length == 0 ? req.body.p_defaultImages.split(",") : images,

      p_days_plan: JSON.parse(req.body.p_days_plan),
      p_policies: {
        cancellation: {
          from: req.body.p_start_date,
          to: req.body.p_refund_date,
          description: req.body.p_refund_desc,
        },
      },
      p_flight: JSON.parse(req.body.p_flight),
      p_return_flight: JSON.parse(req.body.p_return_flight),
      p_transport: JSON.parse(req.body.p_transport),
      p_hotel: JSON.parse(req.body.p_hotel),
      p_keywords: req.body.p_keywords.split(","),
    };
    await travelPackageModel.findByIdAndUpdate(req.params.id, data);
    res.status(200).send("Package updated successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};
