import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index";
import postAccountData from "./routes/postAccountData";
import getAccountData from "./routes/getAccountData";
import cors from "cors"
dotenv.config({
  path: ".env",
});



const app = express();
// CORS configuration
app.use(cors({
  origin: '*', // Change to specific domains if needed
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
}));
app.use(express.json());
// first db Should be connected properly then do other things
connectDB()
  .then(() => {
    // expect response in json format
   
    // start using routes
    app.use("/api/postAccountData", postAccountData);
    app.use("/api/getAccountData", getAccountData);

    // start the server
    app.listen(process.env.PORT, () => {
      console.log(
        `Server is running at ${process.env.PORT} and Path is http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(`Error : could not able to start server ${error.message}`);
  });
