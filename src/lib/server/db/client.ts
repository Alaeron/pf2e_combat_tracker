import { sql } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/libsql';

const db = drizzle({
    connection: {
        url: `file://${process.env.DB_URL}`
    }
});

db.run(sql`PRAGMA foreign_keys = ON`);

export { db };
