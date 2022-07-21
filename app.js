const express = require("express");
const mongoose = require("mongoose");
const shareRouter = require("./lannister.route");
const PORT = 8090;
const dotenv = require("dotenv").config();
const app = express();
app.use(express.json());
const connectDB = async () => {
  try {
    await mongoose.connect( process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connect Database");
  } catch (error) {
    console.log(error);
  }
};
connectDB();
app.use("/split-payments", shareRouter);
app.get("/", (res) => {
  res.send({
    message: "Welcome to Lannister.",
  });
});
app.listen(PORT, () => {
  console.log("App is listening to port ", PORT);
});
