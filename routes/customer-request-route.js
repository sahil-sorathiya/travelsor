import express from "express";
import {
  createCustomerRequest,
  deleteCustomerRequest,
  getCustomerRequests,
} from "../controllers/customer-requests-controller.js";

const customerRequestRouter = express.Router();

customerRequestRouter.post("/createCustomerRequest", createCustomerRequest);
customerRequestRouter.get("/getCustomerRequests/:id", getCustomerRequests);
customerRequestRouter.delete(
  "/deleteCustomerRequest/:id",
  deleteCustomerRequest
);
export default customerRequestRouter;
