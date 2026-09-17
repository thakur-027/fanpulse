import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.model.js";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const demoUsers = [
    { name: "Alex Organizer", email: "organizer@fanpulse.demo", password: "password123", role: "organizer" },
    { name: "Sam Volunteer", email: "volunteer@fanpulse.demo", password: "password123", role: "volunteer" },
  ];

  for (const u of demoUsers) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      await User.create(u);
      console.log(`Created demo user: ${u.email} / password123`);
    } else {
      console.log(`Already exists: ${u.email}`);
    }
  }

  await mongoose.disconnect();
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
