import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import jwt from "jsonwebtoken";
// declare global {
//   var signin: () => Promise<string[]>;
// }

declare global {
  var signin: (id?: string) => string[];
}
jest.mock("../nats-wrapper");

process.env.STRIPE_KEY =
  "sk_test_51Jw1X5Cc0LH5D4U4rdXsozpWxLDiO2kQu2KQtjTMLYTH9dLZ5twnBO4VcaYYJLimsQHKKwdjoo9fpeEK7oK0INky00ZCUk3W6g";
let mongo: any;
beforeAll(async () => {
  jest.clearAllMocks();
  process.env.JWT_KEY = "asdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // const email = "test@test.com";
  // const password = "password";
  // const response = await request(app)
  //   .post("/api/users/signup")
  //   .send({
  //     email,
  //     password,
  //   })
  //   .expect(201);
  // const cookie = response.get("Set-Cookie");
  // return cookie;
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`express:sess=${base64}`];
};
