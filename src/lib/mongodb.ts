// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb"
import '@/lib/env';

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  // In a development environment without a MONGODB_URI, we don't want to connect.
  // We'll rely on the mock data store.
  console.warn("MONGODB_URI not found. App will use in-memory data store.");
  // We create a dummy promise that will never resolve to prevent connection attempts.
  clientPromise = new Promise(() => {});
} else {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
