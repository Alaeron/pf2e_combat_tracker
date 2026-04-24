import { query} from "$app/server"
import { eq } from "drizzle-orm"
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

export {
    getTeam,
    getAllTeams,
}
