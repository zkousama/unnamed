import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

console.log('>> TURSO_CONNECTION_URL=', process.env.TURSO_CONNECTION_URL);
console.log('>> TURSO_AUTH_TOKEN=', process.env.TURSO_AUTH_TOKEN);

export default defineConfig({
  schema: './src/db/auth-schema.ts',
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
