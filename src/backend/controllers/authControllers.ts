import { generateToken } from "../utils/jwt";
import { NextResponse } from "next/server";
import { connectDB } from "../config/db";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

export async function registerHandler(req: Request) {
  await connectDB();
  const { name, email, password } = await req.json();
  console.log("req", req);

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashed });

  const token = generateToken({ id: newUser._id, isAdmin: newUser.isAdmin });

  return NextResponse.json({ user: newUser, token });
}

export async function loginHandler(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );

  const token = generateToken({ id: user._id, isAdmin: user.isAdmin });

  return NextResponse.json({ user, token });
}
