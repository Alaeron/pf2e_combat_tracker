import { building } from '$app/environment';
import { sql } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/libsql';

let db = undefined as unknown as db;

if (!building) {
    db = drizzle({
        connection: {
            url: `file://${process.env.DB_URL}`
        }
    });

    db.run(sql`PRAGMA foreign_keys = ON`);
}

export { db };
