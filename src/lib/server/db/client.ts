import { drizzle } from 'drizzle-orm/libsql';

const db = drizzle({
    connection: {
        url: `file://${process.env.DB_URL}`
    }
});

export { db };
