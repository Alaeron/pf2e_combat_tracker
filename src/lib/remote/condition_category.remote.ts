import { query, form, command } from "$app/server"
import { eq, sql } from "drizzle-orm"
import { db } from "$lib/server/db/client"
import { conditionCategory } from "$lib/server/db/schema"
import z from 'zod'
import { error } from "@sveltejs/kit"


const getConditionCategory = query(z.int(), async (id: number) => {
    const foundCategory = await db
        .select({
            id: conditionCategory.id,
            name: conditionCategory.name,
            color: conditionCategory.color
        })
        .from(conditionCategory)
        .where(eq(condition.id, id))
        .get()

    if (!foundCategory) {
        error(404, "Not found.")
    }

    return foundCategory
});

const getAllConditionCategories = query(async () => {
    const foundCategories = await db
        .select({
            id: conditionCategory.id,
            name: conditionCategory.name,
            color: conditionCategory.color
        })
        .from(conditionCategory)
        .all()

    if (foundCategories.length === 0) {
        return []
    }

    return foundCategories
});

const updateAllConditionCategories = form(
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
        const conditionCategories = await db.insert(conditionCategory)
            .values(data)
            .onConflictDoUpdate({
                target: conditionCategory.id,
                set: {
                    name: sql.raw(`excluded.${conditionCategory.name.name}`),
                    color: sql.raw(`excluded.${conditionCategory.color.name}`),
                }
            })
            .returning()
            .all()

        return conditionCategories
    }
);

const addConditionCategory = form(
    z.object({
        name: z.string().min(1),
        color: z.string().min(7),
    }),
    async({name, color}) => {
        const newConditionCategory = await db.insert(conditionCategory)
            .values({name: name, color: color})
            .returning()
            .get()

        return newConditionCategory
    }
)

const deleteConditionCategory = command(
    z.object({
        id: z.int().min(1),
    }),
    async({id}) => {
        const deletedConditionCategory = await db.delete(conditionCategory)
            .where(eq(conditionCategory.id, id))
            .returning()
            .get()

        getAllConditionCategories().refresh()

        return deletedConditionCategory
    }
)

export {
    getConditionCategory,
    getAllConditionCategories,
    updateAllConditionCategories,
    addConditionCategory,
    deleteConditionCategory,
}
