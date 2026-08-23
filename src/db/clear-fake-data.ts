import { db } from "./index";
import { users, visits, contacts } from "./schema";

async function clearData() {
  console.log("Clearing fake data...");
  try {
    await db.delete(visits);
    console.log("Cleared visits table.");
    await db.delete(users);
    console.log("Cleared users table.");
    await db.delete(contacts);
    console.log("Cleared contacts table.");
    console.log("Fake data cleared successfully.");
  } catch (error) {
    console.error("Error clearing fake data:", error);
  }
}

clearData();
