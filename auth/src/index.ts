import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Starting up...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY mus be defined");
    //console.log("jwt:", process.env.JWT_KEY);
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI mus be defined");
    //console.log("jwt:", process.env.JWT_KEY);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected auth to mongodb!!!");
  } catch (error) {
    console.log(error);
  }
};

app.listen(3000, () => {
  console.log("Listening  on port 3000 local!!");
});

start();
