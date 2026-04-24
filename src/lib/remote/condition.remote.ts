import { query} from "$app/server"
import { eq } from "drizzle-orm"
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
        .all()

    if (foundConditions.length === 0) {
        return []
    }

    return foundConditions
});

export {
    getCondition,
    getAllConditions,
}
