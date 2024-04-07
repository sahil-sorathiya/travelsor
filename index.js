import express from "express";
import cors from "cors";
import { config } from "dotenv";
import bodyParser from "body-parser";

import Connection from "./database/mongodb.js";

import userRouter from "./routes/user-route.js";
import packageRouter from "./routes/package-route.js";
import agencyRouter from "./routes/agency-route.js";
import customerRequestRouter from "./routes/customer-request-route.js";

const app = express();
app.use(cors());
config();

const PORT = 8000;

app.use(express.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", userRouter);
app.use("/agency", agencyRouter);
app.use("/travelPackage", packageRouter);
app.use("/customer", customerRequestRouter);

Connection();

app.listen(PORT, () => {
  try {
    console.log("Server connected to port: " + PORT);
  } catch (error) {
    console.log("Error connecting to server: ", error);
  }
});
