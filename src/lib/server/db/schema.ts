import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";

const timestamp = {
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .notNull()
        .default(sql`(CURRENT_TIMESTAMP)`),
};

const team = sqliteTable("team", {
    id: integer("id")
        .primaryKey({ autoIncrement: true })
        .notNull(),
    name: text("name")
        .notNull(),
    color: text("color")
        .notNull()
        .default("#404040"),
});
const creature = sqliteTable("creature", {
    id: integer("id")
        .primaryKey({ autoIncrement: true })
        .notNull(),
    name: text("name")
        .notNull(),
});
const conditionCategory = sqliteTable("condition_category", {
    id: integer("id")
        .primaryKey({ autoIncrement: true })
        .notNull(),
    name: text("name")
        .notNull(),
    color: text("color")
        .notNull()
        .default("#707070"),
});
const condition = sqliteTable("condition", {
    id: integer("id")
        .primaryKey({ autoIncrement: true })
        .notNull(),
    name: text("name")
        .notNull(),
    categoryId: integer("category_id")
        .references(() => conditionCategory.id, {onDelete: "cascade"})
        .notNull(),
    valueRequired: integer("value_required", { mode: 'boolean' })
        .notNull()
        .default(true),
});
const session = sqliteTable("session", {
    id: integer("id")
        .primaryKey({ autoIncrement: true })
        .notNull(),
    name: text("name")
        .notNull()
        .default("New Session"),
    ...timestamp,
});
const sessionCreature = sqliteTable("session_creature", {
    sessionId: integer("session_id")
        .references(() => session.id, {onDelete: "cascade"})
        .notNull(),
    creatureId: integer("creature_id")
        .references(() => creature.id, {onDelete: "cascade"})
        .notNull(),
    teamId: integer("team_id")
        .references(() => team.id, {onDelete: "cascade"})
        .notNull(),
    isDead: integer("is_dead", { mode: 'boolean' })
        .notNull()
        .default(false),
    order: integer()
        .notNull(),
    round: integer()
        .notNull()
        .default(0)
}, (table) => [
    primaryKey({ columns: [ table.sessionId, table.creatureId ] }),
]);
const sessionCondition = sqliteTable("session_condition", {
    sessionId: integer("session_id")
        .references(() => session.id, {onDelete: "cascade"})
        .notNull(),
    creatureId: integer("creature_id")
        .references(() => creature.id, {onDelete: "cascade"})
        .notNull(),
    conditionId: integer("condition_id")
        .references(() => condition.id, {onDelete: "cascade"})
        .notNull(),
    value: integer("value")
        .default(sql`NULL`),
}, (table) => [
    primaryKey({ columns: [ table.sessionId, table.creatureId, table.conditionId ] }),
]);

export {
    team,
    session,
    creature,
    condition,
    conditionCategory,
    sessionCreature,
    sessionCondition
};
