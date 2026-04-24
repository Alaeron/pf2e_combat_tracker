import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/lib/server/db/schema.ts",
    dialect: "sqlite",
    dbCredentials: {
        url: process.env.DB_URL as string,
    },
    out: "./src/lib/server/db/migrations",
});
