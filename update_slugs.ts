import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function updateSlugs() {
  const client = postgres(process.env.DATABASE_URL!, { max: 1 });
  try {
    console.log("Updating Research Paper ID from DOC-4915 to heart-attack-detecting-necklace...");
    await client`
      UPDATE research_papers
      SET id = 'heart-attack-detecting-necklace'
      WHERE id = 'DOC-4915'
    `;
    console.log("✓ Successfully updated Research Paper URL slug to /research/heart-attack-detecting-necklace");

    console.log("Checking and updating Project ID from prj_mqqx2sv0 to xmeeta...");
    await client`
      UPDATE projects
      SET id = 'xmeeta'
      WHERE id = 'prj_mqqx2sv0'
    `;
    console.log("✓ Successfully updated Project URL slug to /projects/xmeeta");
  } catch (e) {
    console.error("Error updating database slugs:", e);
  } finally {
    await client.end();
  }
}

updateSlugs();
