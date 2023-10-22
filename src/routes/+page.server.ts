import type { Actions, PageServerLoad } from './$types';

const sleep = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
export const load: PageServerLoad = async ({ fetch }) => {
	// await fetch('http//joyofcode.xyz');
};

export const actions: Actions = {
	default: async ({ locals }) => {
		console.log(locals);
	}
};
