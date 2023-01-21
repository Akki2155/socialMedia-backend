import mongoose from "mongoose";
import UserSchema from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signinUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await UserSchema.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "Email ID doesn't Exist !" });
    }
  // console.log(existingUser);
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    // console.log(isPasswordCorrect);
 
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: " Email Id and password doesn't Match !" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "akash",
      { expiresIn: "1h" }
    );
    //  console.log(token);

    return res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: " Something went Wrong " });
  }
};

export const signupUser = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    const existingUser = await UserSchema.findOne({ email });
    // console.log('exist',existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "Email ID  Exist !" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password doesn't Match !" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserSchema.create({
      name:`${firstName} ${lastName}`,
      email,
      password: hashedPassword,
    });

    console.log(result);

    const token = jwt.sign({ email: result.email, id: result._id }, "akash", {
      expiresIn: "1h",
    });

   console.log(token);
    res.status(200).json({ result: result, token });
  } catch (error) {
    res.status(500).json({ message: " Something went Wrong " });
  }
};
