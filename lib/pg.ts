import { Pool } from "pg";

const globalForPool = globalThis as unknown as {
  entoPool?: Pool;
};

export const pgPool =
  globalForPool.entoPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

if (!globalForPool.entoPool) {
  globalForPool.entoPool = pgPool;
}
