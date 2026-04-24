import { query, form, command } from "$app/server"
import { eq, sql } from "drizzle-orm"
import { db } from "$lib/server/db/client"
import { team } from "$lib/server/db/schema"
import z from 'zod'
import { error } from "@sveltejs/kit"


const getTeam = query(z.int(), async (id: number) => {
    const foundTeam = await db
        .select()
        .from(team)
        .where(eq(team.id, id))
        .get()

    if (!foundTeam) {
        error(404, "Not found.")
    }

    return foundTeam
});

const getAllTeams = query(async () => {
    const foundTeams = await db
        .select()
        .from(team)
        .all()

    if (foundTeams.length === 0) {
        return []
    }

    return foundTeams
});

const addTeam = form(
    z.object({
        name: z.string().min(1),
        color: z.string().min(7),
    }),
    async({name, color}) => {
        const newTeam = await db.insert(team)
            .values({name: name, color: color})
            .returning()
            .get()

        return newTeam
    }
)
const deleteTeam = command(
    z.object({
        id: z.int().min(1),
    }),
    async({id}) => {
        const deletedTeam = await db.delete(team)
            .where(eq(team.id, id))
            .returning()
            .get()

        getAllTeams().refresh()

        return deletedTeam
    }
)

const updateAllTeams = form(
    z.object({
        id: z.array(z.string().min(1)),
        name: z.array(z.string().min(1)),
        color: z.array(z.string().min(7))
    }),
    async ({id, name, color}) => {
        const data = id.map((item) => {
            return {
                id: item,
                name: name[id.indexOf(item)],
                color: color[id.indexOf(item)],
            }
        })
        const teams = await db.insert(team)
            .values(data)
            .onConflictDoUpdate({
                target: team.id,
                set: {
                    name: sql.raw(`excluded.${team.name.name}`),
                    color: sql.raw(`excluded.${team.color.name}`),
                }
            })
            .returning()
            .all()

        return teams
    }
);

export {
    getTeam,
    getAllTeams,
    updateAllTeams,
    addTeam,
    deleteTeam,
}
