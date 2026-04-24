import { query} from "$app/server"
import { eq } from "drizzle-orm"
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

export {
    getConditionCategory,
    getAllConditionCategories,
}
