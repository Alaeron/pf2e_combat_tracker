import { query, form, command } from "$app/server"
import { eq, notInArray, sql } from "drizzle-orm"
import { db } from "$lib/server/db/client"
import { condition, conditionCategory } from "$lib/server/db/schema"
import z from 'zod'
import { error } from "@sveltejs/kit"


const getCondition = query(z.int(), async (id: number) => {
    const foundCondition = await db
        .select({
            id: condition.id,
            name: condition.name,
            valueRequired: condition.valueRequired,
            categoryId: conditionCategory.id,
            categoryName: conditionCategory.name,
            categoryColor: conditionCategory.color
        })
        .from(condition)
        .innerJoin(conditionCategory, eq(condition.categoryId, conditionCategory.id))
        .where(eq(condition.id, id))
        .get()

    if (!foundCondition) {
        error(404, "Not found.")
    }

    return foundCondition
});

const getAllConditions = query(async () => {
    const foundConditions = await db
        .select({
            id: condition.id,
            name: condition.name,
            valueRequired: condition.valueRequired,
            categoryId: conditionCategory.id,
            categoryName: conditionCategory.name,
            categoryColor: conditionCategory.color
        })
        .from(condition)
        .innerJoin(conditionCategory, eq(condition.categoryId, conditionCategory.id))
        .orderBy(sql`lower(${condition.name})`)
        .all()

    if (foundConditions.length === 0) {
        return []
    }

    return foundConditions
});


const updateAllConditions = form(
    z.object({
        id: z.array(z.string().min(1)),
        name: z.array(z.string().min(1)),
        categoryId: z.array(z.string().min(1)),
        valueRequired: z.array(z.optional(z.boolean()))
    }),
    async ({id, name, categoryId, valueRequired}) => {
        const data = id.map((item) => {
            return {
                id: item,
                name: name[id.indexOf(item)],
                categoryId: categoryId[id.indexOf(item)],
                valueRequired: valueRequired[id.indexOf(item)] !== undefined,
            }
        })

        await db.transaction(async (tx) => {
            await tx.delete(condition)
                .where(notInArray(condition.id, id))

            const conditions = await tx.insert(condition)
                .values(data)
                .onConflictDoUpdate({
                    target: condition.id,
                    set: {
                        name: sql.raw(`excluded.${condition.name.name}`),
                        categoryId: sql.raw(`excluded.${condition.categoryId.name}`),
                        valueRequired: sql.raw(`excluded.${condition.valueRequired.name}`),
                    }
                })
                .returning()
                .all()

            return conditions
        })
    }
);


const addCondition = form(
    z.object({
        name: z.string().min(1),
        categoryId: z.string().min(1),
        valueRequired: z.optional(z.boolean()),
    }),
    async({name, categoryId, valueRequired}) => {
        const newCondition = await db.insert(condition)
            .values({
                name: name,
                categoryId: categoryId,
                valueRequired: valueRequired !== undefined,
            })
            .returning()
            .get()

        return newCondition
    }
)

const deleteCondition = command(
    z.object({
        id: z.int().min(1),
    }),
    async({id}) => {
        const deletedCondition = await db.delete(condition)
            .where(eq(condition.id, id))
            .returning()
            .get()

        getAllConditions().refresh()

        return deletedCondition
    }
)

export {
    getCondition,
    getAllConditions,
    updateAllConditions,
    addCondition,
    deleteCondition,
}
