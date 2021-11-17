import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

import { validateRequest, BadRequestError } from "@mk_tickets/common";
// import { DatabaseConnectionError } from "../errors/database-connection-error";
//import "express-async-errors";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("email mus be validdd"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password must  be between  4 and 20  characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // console.log("Email in use");
      // return res.send({});
      throw new BadRequestError("Email in use");
    }
    const user = User.build({ email, password });

    await user.save();

    // if(! process.env.JWT_KEY){
    //   throw new Error("asas")
    // }
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
