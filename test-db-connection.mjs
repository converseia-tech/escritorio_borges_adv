// Teste de conexão com Supabase PostgreSQL
import "dotenv/config";
import postgres from "postgres";

async function testConnection() {
  console.log("Testing connection to Supabase...");
  console.log("DATABASE_URL:", process.env.DATABASE_URL?.substring(0, 50) + "...");

  try {
    const client = postgres(process.env.DATABASE_URL, {
      max: 1,
      ssl: 'require',
    });

    // Teste simples
    const result = await client`SELECT NOW() as now, version()`;
    console.log("✅ Connection successful!");
    console.log("Server time:", result[0].now);
    console.log("PostgreSQL version:", result[0].version);

    // Testar query nas tabelas
    const practiceAreas = await client`SELECT COUNT(*) as count FROM practice_areas`;
    console.log("✅ practice_areas table exists with", practiceAreas[0].count, "rows");

    const teamMembers = await client`SELECT COUNT(*) as count FROM team_members`;
    console.log("✅ team_members table exists with", teamMembers[0].count, "rows");

    await client.end();
    console.log("\n🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Connection failed:");
    console.error(error);
    process.exit(1);
  }
}

testConnection();
