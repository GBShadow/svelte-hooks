import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { parseFormData } from 'parse-nested-form-data';

const auth: Handle = async ({ event, resolve }) => {
	if (event.request.method === 'POST') {
		const formData = await event.request.formData();

		const data = parseFormData(formData);

		event.locals.formData = data;
	}
	return resolve(event);
};

const i18n: Handle = async ({ event, resolve }) => {
	const locale = 'pt-BR';
	event.locals.locale = locale;

	return resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('%lang%', locale);
		}
	});
};

const performanceApp: Handle = async ({ event, resolve }) => {
	const route = event.url;

	let start = performance.now();

	const response = await resolve(event);

	let end = performance.now();

	let responseTime = end - start;

	if (responseTime > 2000) {
		console.log(`Slow ${route} took ${responseTime.toFixed(2)} ms`);
	}

	if (responseTime < 1000) {
		console.log(`Fast ${route} took ${responseTime.toFixed(2)} ms`);
	}

	return response;
};

export const handle = sequence(auth, i18n, performanceApp);

export const handleError: HandleServerError = ({ error, event }) => {
	console.log(error);

	return {
		message: 'Yikes'
	};
};

export const handleFetch: HandleFetch = ({ event, fetch, request }) => {
	if (request.url.startsWith('http')) {
		const url = request.url.replace('http', 'https');

		request = new Request(url, request);

		console.log(request.url);
	}

	return fetch(request);
};
