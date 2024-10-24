import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index";
import postAccountData from "./routes/postAccountData";
import getAccountData from "./routes/getAccountData";
dotenv.config({
  path: ".env",
});
const app = express();
// first db Should be connected properly then do other things
connectDB()
  .then(() => {
    // expect response in json format
    app.use(express.json());
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
