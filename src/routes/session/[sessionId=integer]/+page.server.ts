import { getSession } from '$lib/remote/session.remote';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const sessionId: number = parseInt(params.sessionId);

    const session = await getSession(sessionId);

    if (!session) error(404);

    return {
        sessionId: session.id
    }
}
