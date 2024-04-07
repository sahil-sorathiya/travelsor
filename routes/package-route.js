import express from "express";
import { getBookedPackageById } from "../controllers/booked-package-controller.js";
import {
  cancelBooking,
  confirmBooking,
  getBookingByAgencyId,
  getBookingByPackageId,
  getBookingByUserId,
  getCancelledBookingByAgencyId,
  getTravelHistoryByUserId,
} from "../controllers/booking-controller.js";
import { makePayment } from "../controllers/payment-controller.js";
import { createBookingPackage } from "../controllers/booked-package-controller.js";
import {
  createTravelPackage,
  deleteTravelPackageById,
  getAllTravelPackages,
  getPackageRecommendation,
  getRecentlyAddedTravelPackages,
  getSpecialOfferPackages,
  getTravelPackageById,
  getTravelPackagesByDestination,
  updateTravelPackage,
} from "../controllers/travel-package-controller.js";
import multer from "multer";
const packageRouter = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
packageRouter.post("/create", upload.any(), createTravelPackage);

packageRouter.post("/payment", makePayment);
packageRouter.post("/confirmBooking/:id", confirmBooking);

packageRouter.post("/createBookedPackage", createBookingPackage);

packageRouter.put("/cancelBooking/:id", cancelBooking);
packageRouter.put(
  "/updateTravelPackage/:id",
  upload.any(),
  updateTravelPackage
);

packageRouter.get("/getBookingByAgency/:id", getBookingByAgencyId);
packageRouter.get(
  "/getCancelledBookingByAgency/:id",
  getCancelledBookingByAgencyId
);
packageRouter.get("/getBookingByUser/:id", getBookingByUserId);
packageRouter.get("/getBookingByPkg/:id", getBookingByPackageId);
packageRouter.get("/getBookedPackage/:id", getBookedPackageById);

packageRouter.post(
  "/getRecentlyAddedTravelPackages",
  getRecentlyAddedTravelPackages
);
packageRouter.get(
  "/getTravelPackagesByDestination/:destination",
  getTravelPackagesByDestination
);
packageRouter.get(
  "/getSpecialOfferPackages/:discount",
  getSpecialOfferPackages
);
packageRouter.get("/getPackageRecommendations/:id", getPackageRecommendation);
packageRouter.get("/getTravelHistory/:id", getTravelHistoryByUserId);

packageRouter.get("/getAllPackages/:agencyId", getAllTravelPackages);
packageRouter.get("/getTravelPackage/:id", getTravelPackageById);

packageRouter.delete("/deletePackage/:id", deleteTravelPackageById);

export default packageRouter;
