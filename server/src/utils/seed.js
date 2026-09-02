/**
 * Seed script - creates demo accounts for local development/testing.
 *
 * Run with: npm run seed
 *
 * This exists because public registration always creates a "writer"
 * account (see authController.js), so there is no way to obtain an
 * "editor" account to test role authorization without a trusted,
 * non-public path to create one.
 *
 * Idempotent: running it multiple times will not create duplicates.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const SALT_ROUNDS = 10;

const DEMO_USERS = [
  {
    name: "Demo Editor",
    email: "editor@example.com",
    password: "Editor@123",
    role: "editor",
  },
  {
    name: "Demo Writer",
    email: "writer@example.com",
    password: "Writer@123",
    role: "writer",
  },
];

const seed = async () => {
  await connectDB();

  for (const demoUser of DEMO_USERS) {
    const email = demoUser.email.toLowerCase();
    const existing = await User.findOne({ email });

    if (existing) {
      console.log(`Skipped (already exists): ${email}`);
      continue;
    }

    const passwordHash = await bcrypt.hash(demoUser.password, SALT_ROUNDS);

    await User.create({
      name: demoUser.name,
      email,
      passwordHash,
      role: demoUser.role,
    });

    console.log(`Created: ${email} (${demoUser.role})`);
  }

  console.log("Seeding complete.");
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});