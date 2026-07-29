// Add this line at the very top of test-db.js
require("dotenv").config({ path: ".env.development" })

const { MongoClient } = require("mongodb")

// Double-check that your .env file uses exactly this variable name
const uri = process.env.GATSBY_MONGODB_URI

// Temporarily hardcode your string just to test the connection
// const uri =
//   "mongodb+srv://kodemonkey:Girlz4x42!@cluster0.9kztbpj.mongodb.net/?appName=Cluster0"

if (!uri) {
  console.error("❌ Error: MONGODB_URI is undefined. Check your .env file!")
  process.exit(1)
}

async function run() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log("✅ Successfully connected to MongoDB!")
    const databasesList = await client.db().admin().listDatabases()
    console.log("Available Databases:")
    databasesList.databases.forEach(db => console.log(` - ${db.name}`))
  } catch (error) {
    console.error("❌ Connection failed:", error.message)
  } finally {
    await client.close()
  }
}
run()
