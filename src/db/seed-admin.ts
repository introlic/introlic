import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import { admins } from "./schema";

dotenv.config({ path: ".env.local" });

const seedAdmin = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const client = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  const adminEmail = "mf9coding@introlic.in";
  const adminUsername = "mf9coding";
  const adminPassword = "mf9coding#123";

  console.log("Seeding admin...");
  
  // Hash the password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  try {
    await db.insert(admins).values({
      name: "MF9 Coding Admin",
      username: adminUsername,
      email: adminEmail,
      passwordHash: passwordHash,
      role: "superadmin",
      status: "active",
    }).onConflictDoUpdate({
      target: admins.username,
      set: {
        passwordHash: passwordHash,
        name: "MF9 Coding Admin",
        email: adminEmail,
        role: "superadmin",
        status: "active",
      }
    });
    
    console.log("Admin seeded successfully! Username: mf9coding, Email: mf9coding@introlic.in");
  } catch (error) {
    console.error("Failed to seed admin:", error);
  } finally {
    await client.end();
  }
};

seedAdmin().catch(console.error);

