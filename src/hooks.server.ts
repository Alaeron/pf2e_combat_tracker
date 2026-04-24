import { db } from '$lib/server/db/client';
import { condition, conditionCategory, team } from '$lib/server/db/schema';
import type { ServerInit } from '@sveltejs/kit';
import { drizzle } from "drizzle-orm/libsql"
import { migrate } from "drizzle-orm/libsql/migrator"

export const init: ServerInit = async () => {
	console.log("Running migrations...");

    const migrationClient = drizzle({
        connection: {
            url: `file://${process.env.DB_URL}`
        }
    });

    try {
        await migrate(migrationClient, { migrationsFolder: "./src/lib/server/db/migrations"});
        console.log("Database migrations completed successfully.")
    } catch (error) {
        console.error("Migration failed: ", error)
        throw error;
    }

    // Bootstrap data
    const teamCount = await migrationClient.$count(team)
    const categoryCount = await migrationClient.$count(conditionCategory)
    const conditionCount = await migrationClient.$count(condition)

    if (teamCount === 0 && categoryCount === 0 && conditionCount === 0) {
        console.log("Uninitialized database detected. Bootstrapping initial data...")

        await db.transaction(async (tx) => {
            await tx.insert(team).values([
                {id: 1, name: 'Friendly',    color: '#303070'},
                {id: 2, name: 'Hostile',     color: '#703030'},
                {id: 3, name: 'Environment', color: '#404040'},
                {id: 4, name: 'Neutral',     color: '#707030'}
            ])
            await tx.insert(conditionCategory).values([
                {id: 1, name: 'senses',    color: '#918c47'},
                {id: 2, name: 'lowered',   color: '#7d2b91'},
                {id: 3, name: 'mental',    color: '#af5b55'},
                {id: 4, name: 'death',     color: '#000000'},
                {id: 5, name: 'movement',  color: '#ad7a3f'},
                {id: 6, name: 'detection', color: '#2b2b91'},
                {id: 7, name: 'buff',      color: '#3f9b3f'},
                {id: 8, name: 'damage',    color: '#b31f1f'}
            ])
            await tx.insert(condition).values([
                {id: 1,  name: "Blinded",             valueRequired: false, categoryId: 1},
                {id: 2,  name: "Clumsy",              valueRequired: true,  categoryId: 2},
                {id: 3,  name: "Concealed",           valueRequired: false, categoryId: 1},
                {id: 4,  name: "Confused",            valueRequired: false, categoryId: 3},
                {id: 5,  name: "Controlled",          valueRequired: false, categoryId: 3},
                {id: 6,  name: "Dazzled",             valueRequired: false, categoryId: 1},
                {id: 7,  name: "Deafened",            valueRequired: false, categoryId: 1},
                {id: 8,  name: "Doomed",              valueRequired: true,  categoryId: 4},
                {id: 9,  name: "Drained",             valueRequired: true,  categoryId: 2},
                {id: 10, name: "Dying",               valueRequired: true,  categoryId: 4},
                {id: 11, name: "Encumbered",          valueRequired: false, categoryId: 5},
                {id: 12, name: "Enfeebled",           valueRequired: true,  categoryId: 2},
                {id: 13, name: "Fascinated",          valueRequired: false, categoryId: 3},
                {id: 14, name: "Fatigued",            valueRequired: false, categoryId: 2},
                {id: 15, name: "Fleeing",             valueRequired: false, categoryId: 5},
                {id: 16, name: "Frightened",          valueRequired: false, categoryId: 3},
                {id: 17, name: "Grabbed",             valueRequired: false, categoryId: 5},
                {id: 18, name: "Hidden",              valueRequired: false, categoryId: 6},
                {id: 19, name: "Immobilized",         valueRequired: false, categoryId: 1},
                {id: 20, name: "Invisible",           valueRequired: false, categoryId: 5},
                {id: 21, name: "Observed",            valueRequired: false, categoryId: 6},
                {id: 22, name: "Off-Guard",           valueRequired: false, categoryId: 2},
                {id: 23, name: "Paralyzed",           valueRequired: false, categoryId: 5},
                {id: 24, name: "Persist. Damage",     valueRequired: true,  categoryId: 8},
                {id: 25, name: "Petrified",           valueRequired: false, categoryId: 5},
                {id: 26, name: "Prone",               valueRequired: false, categoryId: 5},
                {id: 27, name: "Quickened",           valueRequired: false, categoryId: 7},
                {id: 28, name: "Restrained",          valueRequired: false, categoryId: 5},
                {id: 29, name: "Sickened",            valueRequired: true,  categoryId: 2},
                {id: 30, name: "Slowed",              valueRequired: true,  categoryId: 2},
                {id: 31, name: "Stunned",             valueRequired: true,  categoryId: 3},
                {id: 32, name: "Stupefied",           valueRequired: true,  categoryId: 2},
                {id: 33, name: "Taunted",             valueRequired: false, categoryId: 3},
                {id: 34, name: "Unconscious",         valueRequired: false, categoryId: 4},
                {id: 35, name: "Undetected",          valueRequired: false, categoryId: 6},
                {id: 36, name: "Unnoticed",           valueRequired: false, categoryId: 6},
                {id: 37, name: "Wounded",             valueRequired: true,  categoryId: 4},
                {id: 38, name: "Other Buff",          valueRequired: true,  categoryId: 7},
                {id: 39, name: "Other Debuff",        valueRequired: true,  categoryId: 3},
                {id: 41, name: "Duration",            valueRequired: true,  categoryId: 4},
                {id: 42, name: "Bravos Brew",         valueRequired: true,  categoryId: 7},
                {id: 43, name: "Cat's Eye Elixir",    valueRequired: true,  categoryId: 7},
                {id: 44, name: "Juggernaut Mutagen",  valueRequired: true,  categoryId: 7},
                {id: 45, name: "Numbing Tonic",       valueRequired: true,  categoryId: 7},
                {id: 46, name: "Quicksilver Mutagen", valueRequired: true,  categoryId: 7},
                {id: 47, name: "Other Elixir",        valueRequired: true,  categoryId: 7},
                {id: 48, name: "Other Mutagen",       valueRequired: true,  categoryId: 7}
            ])
        })
        console.log("Initial data bootstrap complete.")
    } else {
        console.log("Initialized database detected. Continuing...")
    }

    console.log("Database initialization complete.")
};
