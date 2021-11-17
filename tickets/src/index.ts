import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancalledListener } from "./events/listeners/order-cancelled-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY mus be defined");
    //console.log("jwt:", process.env.JWT_KEY);
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI mus be defined");
    //console.log("jwt:", process.env.JWT_KEY);
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID mus be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID mus be defined");
  }
  if (!process.env.NATS_URI) {
    throw new Error("NATS_URI mus be defined");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCancalledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected tickets to mongodb!!!");
  } catch (error) {
    console.log(error);
  }
};

app.listen(3000, () => {
  console.log("Listening  on port 3000 local!!");
});

start();
