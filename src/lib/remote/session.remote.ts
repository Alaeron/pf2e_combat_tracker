import { query, command, form } from "$app/server"
import { eq, and, sql, not } from "drizzle-orm"
import { db } from "$lib/server/db/client"
import { condition, sessionCondition, session, sessionCreature, team, conditionCategory } from "$lib/server/db/schema"
import z from 'zod'
import { error } from "@sveltejs/kit"
import type { SQLiteTransaction } from "drizzle-orm/sqlite-core"

// function dedupeById(array: { id: number }[]) {
//     const seen = new Set();
//     return array.filter(item => {
//         const duplicate = seen.has(item.id);
//         seen.add(item.id);
//         return !duplicate
//     })
// }

const addSession = form(
    z.object({
        name: z.string().min(1)
    }),
    async ({name}) => {
        const newSession = await db
            .insert(session)
            .values({name: name})
            .returning()
            .get()

        return newSession
});

const updateSession = command(
    z.object({
        sessionId: z.int().min(1),
        name: z.string().min(1)
    }),
    async ({sessionId, name}) => {
        const updatedSession = await db
            .update(session)
            .set({name: name})
            .where(eq(session.id, sessionId))
            .returning()
            .get()

        void getSession().refresh()
        void getAllSessions().refresh()
        void getSessionState().refresh()

        return updatedSession
});

const getSession = query(z.int(), async (id: number) => {
    const foundSession = await db
        .select()
        .from(session)
        .where(eq(session.id, id))
        .get()

    if (!foundSession) {
        error(404, "Not found.")
    }

    return foundSession
});

const getAllSessions = query(async () => {
    const foundSessions = await db
        .select()
        .from(session)
        .orderBy(sql`lower(${session.name})`)

    return foundSessions
});

const getSessionState = query(z.int(), async (id: number) => {
    let foundSessionState = await db
        .select({
            sessionId: session.id,
            sessionName: session.name,
            creatureId: sessionCreature.id,
            creatureName: sessionCreature.name,
            teamId: sessionCreature.teamId,
            teamName: team.name,
            teamColor: team.color,
            round: sessionCreature.round,
            order: sessionCreature.order,
            isDead: sessionCreature.isDead,
            conditionId: sessionCondition.conditionId,
            conditionName: condition.name,
            conditionCategoryId: conditionCategory.id,
            conditionCategoryName: conditionCategory.name,
            conditionCategoryColor: conditionCategory.color,
            conditionAutoReduceStart: sessionCondition.autoReduceStart,
            conditionAutoReduceEnd: sessionCondition.autoReduceEnd,
            conditionValue: sessionCondition.value,
        })
        .from(session)
        .leftJoin(sessionCreature, eq(session.id, sessionCreature.sessionId))
        .leftJoin(team, eq(team.id, sessionCreature.teamId))
        .leftJoin(sessionCondition, and(
            eq(session.id, sessionCondition.sessionId),
            eq(sessionCondition.creatureId, sessionCreature.id)
        ))
        .leftJoin(condition, eq(condition.id, sessionCondition.conditionId))
        .leftJoin(conditionCategory, eq(conditionCategory.id, condition.categoryId))
        .where(eq(session.id, id))
        .orderBy(sessionCreature.round, sessionCreature.order)
        .all()

    if (!foundSessionState) {
        error(404, "Not found.")
    }

    // Reduce results to list of creatures with a conditions array
    foundSessionState = foundSessionState.reduce((acc, row) => {
        if (!acc[row.creatureId]) {
            acc[row.creatureId] = {
                sessionId: row.sessionId,
                sessionName: row.sessionName,
                creatureId: row.creatureId,
                creatureName: row.creatureName,
                teamId: row.teamId,
                teamName: row.teamName,
                teamColor: row.teamColor,
                round: row.round,
                order: row.order,
                isDead: row.isDead,
                conditions: []
            }
        }
        if (row.conditionId) {
            acc[row.creatureId].conditions.push({
                id: row.conditionId,
                name: row.conditionName,
                categoryId: row.conditionCategoryId,
                categoryName: row.conditionCategoryName,
                categoryColor: row.conditionCategoryColor,
                autoReduceStart: row.conditionAutoReduceStart,
                autoReduceEnd: row.conditionAutoReduceEnd,
                value: row.conditionValue,
            })
        }
        return acc
    }, {})
    foundSessionState = Object.values(foundSessionState)

    // Reduce results to a single session with a list of creatures
    const formattedResults: {
        id: number,
        name: string,
        round: number,
        creatures: {
            id: number,
            name: string,
            team: {
                id: number,
                name: string,
                color: string
            }
            round: number,
            order: number,
            isDead: boolean,
            conditions: {
                id: number,
                name: string,
                categoryId: number,
                categoryName: string,
                categoryColor: string,
                autoReduceStart: boolean | null,
                autoReduceEnd: boolean | null,
                value: number | null,
            }[]
        }[]
    } = foundSessionState.reduce((acc, row) => {
        if (!acc["id"]) {
            acc["id"] = row.sessionId
            acc["name"] = row.sessionName
            acc["creatures"] = []
            acc["round"] = Infinity
        }

        if(row.creatureId) {
            acc.round = row.round < acc.round ? row.round : acc.round
            acc.creatures.push({
                id: row.creatureId,
                name: row.creatureName,
                team: {
                    id: row.teamId,
                    name: row.teamName,
                    color: row.teamColor,
                },
                round: row.round,
                order: row.order,
                isDead: row.isDead,
                conditions: row.conditions,
            })
        }
        return acc
    }, {})

    if (formattedResults.round === Infinity) {
        formattedResults.round = 1
    }

    return formattedResults
});

const loadSession = command(
    z.object({
        sessionId: z.int().min(1),
        data: z.json()
    }), async ({sessionId, data}) => {
    const parsedData = JSON.parse(data);

    // For now, just use session data & ids
    // TODO: Implement detection of possible id mismatches / value changes

    // // Extract teams
    // let teams = parsedData.sessionState.creatures.map((c) => {
    //     return {
    //         id: c.team.id,
    //         name: c.team.name,
    //         color: c.team.color,
    //     }
    // })
    // teams = dedupeById(teams)

    // // Extract conditions
    // let conditions = parsedData.sessionState.creatures.flatMap((c) => {
    //     return c.conditions.map(co => {
    //         return {
    //             id: co.id,
    //             name: co.name,
    //             categoryId: co.categoryId,
    //             valueRequired: co.value !== null
    //         }
    //     })
    // })
    // conditions = dedupeById(conditions)

    // Extract session creatures
    const sessionCreatures = parsedData.sessionState.creatures.map((c) => {
        return {
            sessionId: parsedData.sessionState.id,
            id: c.id,
            name: c.name,
            teamId: c.team.id,
            isDead: c.isDead,
            order: c.order,
            round: c.round
        }
    })

    // Extract session conditions
    const sessionConditions = parsedData.sessionState.creatures.flatMap((c) => {
        return c.conditions.map(co => {
            return {
                sessionId: parsedData.sessionState.id,
                creatureId: c.id,
                conditionId: co.id,
                autoReduceStart: co.autoReduceStart,
                autoReduceEnd: co.autoReduceEnd,
                value: co.value,
            }
        })
    })

    // Reset the current session
    await resetSession(sessionId);

    await db.transaction(async (tx: SQLiteTransaction) => {
        // Save session creatures
        const insertedSessionCreatures = await tx.insert(sessionCreature)
            .values(sessionCreatures.map((c) => { return {
                sessionId: sessionId,
                name: c.name,
                teamId: c.teamId,
                isDead: c.isDead,
                order: c.order,
                round: c.round
            }}))
            .returning()
            .all()

        // Save session conditions
        await tx.insert(sessionCondition)
            .values(sessionConditions.map((co) => {
                const targetCreature = sessionCreatures.find((c) => c.id === co.creatureId)
                const newCreatureId = insertedSessionCreatures.find((c) => c.order === targetCreature.order).id
                return {
                    sessionId: sessionId,
                    creatureId: newCreatureId,
                    conditionId: co.conditionId,
                    autoReduceStart: co.autoReduceStart,
                    autoReduceEnd: co.autoReduceEnd,
                    value: co.value
                }
            }))
            .returning()
            .all()
    });
});

const deleteSession = command(z.int(), async (id: number) => {
    const deletedSession = db
        .delete(session)
        .where(eq(session.id, id))
        .returning()
        .get()

    getAllSessions().refresh()

    return deletedSession
});

const addSessionCreature = form(
    z.object({
        sessionId: z.string().min(1),
        name: z.string().min(1),
        teamId: z.string().min(1)
    }),
    async ({ sessionId, name, teamId }) => {

        const newSessionCreature = await db.insert(sessionCreature).values({
            sessionId: sessionId,
            name: name,
            teamId: teamId,
            isDead: false,
            order: sql`(select COALESCE(MAX(sc."order") + 1, 1) FROM session_creature sc WHERE sc.session_id = ${sessionId})`,
            round: sql`(select COALESCE(MAX(sc."round"), 1) FROM session_creature sc WHERE sc.session_id = ${sessionId})`,
        }).returning().get()

        return newSessionCreature
    }
)

const toggleSessionCreatureDeath = command(
    z.object({
        sessionId: z.int().min(1),
        creatureId: z.int().min(1),
    }),
    async ({sessionId, creatureId}) => {
        const creature = db
            .update(sessionCreature)
            .set({
                isDead: not(sessionCreature.isDead),
            })
            .where(and(
                eq(sessionCreature.sessionId, sessionId),
                eq(sessionCreature.id, creatureId)
            ))
            .returning()
            .get()

        void getSessionState(sessionId).refresh()
        return creature
    }
)

const deleteSessionCreature = command(
    z.object({
        sessionId: z.int().min(1),
        creatureId: z.int().min(1),
    }),
    async ({sessionId, creatureId}) => {
        const creature = db
            .delete(sessionCreature)
            .where(and(
                eq(sessionCreature.sessionId, sessionId),
                eq(sessionCreature.id, creatureId)
            ))
            .returning()
            .get()

        void getSessionState(sessionId).refresh()
        return creature
    }
)

const incrementSessionCondition = command(
    z.object({
        sessionId: z.int().min(1),
        creatureId: z.int().min(1),
        conditionId: z.int().min(1)
    }),
    async ({sessionId, creatureId, conditionId}) => {
        const condition = db
            .update(sessionCondition)
            .set({
                value: sql`${sessionCondition.value} + 1`
            })
            .where(and(
                eq(sessionCondition.sessionId, sessionId),
                eq(sessionCondition.creatureId, creatureId),
                eq(sessionCondition.conditionId, conditionId)
            ))
            .returning()
            .get()

        void getSessionState(sessionId).refresh()
        return condition

    }
)

const decrementSessionCondition = command(
    z.object({
        sessionId: z.int().min(1),
        creatureId: z.int().min(1),
        conditionId: z.int().min(1)
    }),
    async ({sessionId, creatureId, conditionId}) => {
        const condition = db
            .update(sessionCondition)
            .set({
                value: sql`${sessionCondition.value} - 1`
            })
            .where(and(
                eq(sessionCondition.sessionId, sessionId),
                eq(sessionCondition.creatureId, creatureId),
                eq(sessionCondition.conditionId, conditionId)
            ))
            .returning()
            .get()

        void getSessionState(sessionId).refresh()
        return condition

    }
)

const updateSessionCondition = command(
    z.object({
        sessionId: z.int().min(1),
        creatureId: z.int().min(1),
        conditionId: z.int().min(1),
        value: z.int(),
        autoReduceStart: z.boolean().nullable(),
        autoReduceEnd: z.boolean().nullable(),
    }),
    async ({sessionId, creatureId, conditionId, value, autoReduceStart, autoReduceEnd}) => {
        const condition = db
            .update(sessionCondition)
            .set({
                value: value,
                autoReduceStart: autoReduceStart,
                autoReduceEnd: autoReduceEnd,
            })
            .where(and(
                eq(sessionCondition.sessionId, sessionId),
                eq(sessionCondition.creatureId, creatureId),
                eq(sessionCondition.conditionId, conditionId)
            ))
            .returning()
            .get()

        void getSessionState(sessionId).refresh()
        return condition

    }
)

const deleteAllSessionCreatureConditions = command(
    z.object({
        sessionId: z.int().min(1),
        creatureId: z.int().min(1),
    }),
    async ({sessionId, creatureId}) => {
        const conditions = db
            .delete(sessionCondition)
            .where(and(
                eq(sessionCondition.sessionId, sessionId),
                eq(sessionCondition.creatureId, creatureId),
            ))
            .returning()

        void getSessionState(sessionId).refresh()
        return conditions
    }
)

const addSessionCreatureCondition = command(
        z.object({
        sessionId: z.int().min(1),
        creatureId: z.int().min(1),
        conditionId: z.int().min(1),
    }),
    async ({sessionId, creatureId, conditionId}) => {
        const conditionDefinition = await db.select().from(condition).where(eq(condition.id, conditionId)).get();
        if (!conditionDefinition) {
            return error(404, "Not found.")
        }

        const conditions = db
            .insert(sessionCondition)
            .values({
                sessionId: sessionId,
                creatureId: creatureId,
                conditionId: conditionId,
                autoReduce: conditionDefinition.valueRequired ? true : null,
                value: conditionDefinition.valueRequired ? 1 : null,
            })
            .returning()

        void getSessionState(sessionId).refresh()
        return conditions
    }
)

const deleteSessionCreatureCondition = command(
        z.object({
        sessionId: z.int().min(1),
        creatureId: z.int().min(1),
        conditionId: z.int().min(1),
    }),
    async ({sessionId, creatureId, conditionId}) => {
        const conditionDefinition = await db.select().from(condition).where(eq(condition.id, conditionId)).get();
        if (!conditionDefinition) {
            return error(404, "Not found.")
        }

        const conditions = db
            .delete(sessionCondition)
            .where(and(
                eq(sessionCondition.sessionId, sessionId),
                eq(sessionCondition.creatureId, creatureId),
                eq(sessionCondition.conditionId, conditionId),
            ))
            .returning()

        void getSessionState(sessionId).refresh()
        return conditions
    }
)

const resetSession = command(
    z.int().min(1),
    async (sessionId) => {
        await db
            .delete(sessionCreature)
            .where(eq(sessionCreature.sessionId, sessionId))
            .returning()
        await db
            .delete(sessionCondition)
            .where(eq(sessionCondition.sessionId, sessionId))
            .returning()

        void getSessionState(sessionId).refresh()
    }
)

const nextSessionTurn = command(
    z.int().min(1),
    async (sessionId) => {

        await db.transaction(async (tx) => {

            // Increase round of lowest order session creature
            const foundSessionCreatureEndTurn = await tx
                .update(sessionCreature)
                .set({ round: sql`${sessionCreature.round} + 1` })
                .where(sql`
                    ${sessionCreature.sessionId}=${sessionId}
                    AND ${sessionCreature.id} IN (
                        SELECT ${sessionCreature.id}
                        FROM ${sessionCreature}
                        WHERE ${sessionCreature.sessionId}=${sessionId}
                        ORDER BY ${sessionCreature.round}, ${sessionCreature.order}
                        LIMIT 1
                    )`
                )
                .returning()
                .get()

            // Reduce session conditions where autoReduceEnd === true
            await tx.update(sessionCondition)
                .set({ value: sql`${sessionCondition.value} - 1` })
                .where(and(
                    eq(sessionCondition.sessionId, sessionId),
                    eq(sessionCondition.creatureId, foundSessionCreatureEndTurn.id),
                    eq(sessionCondition.autoReduceEnd, true)
                ))

            // Reduce session conditions where autoReduceStart === true
            const foundSessionCreatureStartTurn = await tx
                .select()
                .from(sessionCreature)
                .where(sql`
                    ${sessionCreature.sessionId}=${sessionId}
                    AND ${sessionCreature.id} IN (
                        SELECT ${sessionCreature.id}
                        FROM ${sessionCreature}
                        WHERE ${sessionCreature.sessionId}=${sessionId}
                        ORDER BY ${sessionCreature.round}, ${sessionCreature.order}
                        LIMIT 1
                    )`
                )
                .get()

            await tx.update(sessionCondition)
                .set({ value: sql`${sessionCondition.value} - 1` })
                .where(and(
                    eq(sessionCondition.sessionId, sessionId),
                    eq(sessionCondition.creatureId, foundSessionCreatureStartTurn.id),
                    eq(sessionCondition.autoReduceStart, true)
                ))
        })

        void getSessionState(sessionId).refresh()
    }
)

const previousSessionTurn = command(
    z.int().min(1),
    async (sessionId) => {
        await db.transaction(async (tx) => {

            // Increase session conditions where autoReduceStart === true
            const foundSessionCreatureStartTurn = await tx
                .select()
                .from(sessionCreature)
                .where(sql`
                    ${sessionCreature.sessionId}=${sessionId}
                    AND ${sessionCreature.id} IN (
                        SELECT ${sessionCreature.id}
                        FROM ${sessionCreature}
                        WHERE ${sessionCreature.sessionId}=${sessionId}
                        ORDER BY ${sessionCreature.round}, ${sessionCreature.order}
                        LIMIT 1
                    )`
                )
                .get()

            await tx.update(sessionCondition)
                .set({ value: sql`${sessionCondition.value} + 1` })
                .where(and(
                    eq(sessionCondition.sessionId, sessionId),
                    eq(sessionCondition.creatureId, foundSessionCreatureStartTurn.id),
                    eq(sessionCondition.autoReduceStart, true)
                ))

            // Decrease round of highest order session creature
            const foundSessionCreatureEndTurn = await tx
                .update(sessionCreature)
                .set({ round: sql`${sessionCreature.round} - 1` })
                .where(sql`
                    ${sessionCreature.sessionId}=${sessionId}
                    AND ${sessionCreature.id} IN (
                        SELECT ${sessionCreature.id}
                        FROM ${sessionCreature}
                        WHERE ${sessionCreature.sessionId}=${sessionId}
                        ORDER BY ${sessionCreature.round} DESC, ${sessionCreature.order} DESC
                        LIMIT 1
                    )`
                )
                .returning()
                .get()

            // Increase session conditions where autoReduceEnd === true
            await tx.update(sessionCondition)
                .set({ value: sql`${sessionCondition.value} + 1` })
                .where(and(
                    eq(sessionCondition.sessionId, sessionId),
                    eq(sessionCondition.creatureId, foundSessionCreatureEndTurn.id),
                    eq(sessionCondition.autoReduceEnd, true)
                ))


            void getSessionState(sessionId).refresh()
        })
    }
)

const reorderSession = command(
    z.object({
        sessionId: z.int().min(1),
        creatures: z.array(z.object({
            id: z.int().min(1),
            round: z.int()
        })),
    }),
    async ({sessionId, creatures}) => {
        const maxRound = Math.max(...creatures.map((creature) => creature.round));
        const minRound = Math.min(...creatures.map((creature) => creature.round));

        let nextOrder = 1;
        let reorderedCreatures = []

        for (let i = maxRound; i >= minRound; i--) {
            let roundCreatures = creatures.filter((c) => c.round === i)

            roundCreatures = roundCreatures.map((c) => {
                c.order = nextOrder++
                return c
            })
            reorderedCreatures = reorderedCreatures.concat(roundCreatures)
        }

        await db.transaction(async (tx) => {
            for (const c of reorderedCreatures) {
                await tx.update(sessionCreature)
                    .set({order: c.order})
                    .where(and(
                        eq(sessionCreature.sessionId, sessionId),
                        eq(sessionCreature.id, c.id)
                    ))
            }
        });

        void getSessionState(sessionId).refresh()
    }
)

export {
    addSession,
    updateSession,
    getSession,
    getAllSessions,
    getSessionState,
    loadSession,
    deleteSession,
    addSessionCreature,
    toggleSessionCreatureDeath,
    deleteSessionCreature,
    incrementSessionCondition,
    decrementSessionCondition,
    updateSessionCondition,
    deleteSessionCreatureCondition,
    deleteAllSessionCreatureConditions,
    addSessionCreatureCondition,
    resetSession,
    nextSessionTurn,
    previousSessionTurn,
    reorderSession
}
