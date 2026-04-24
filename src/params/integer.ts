import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string) => {
	return !isNaN(parseInt(param))
}) satisfies ParamMatcher;
