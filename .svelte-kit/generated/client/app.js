export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11')
];

export const server_loads = [0];

export const dictionary = {
		"/": [~2],
		"/(app)/admin": [~3],
		"/(app)/calendar": [~4],
		"/(app)/events": [~5],
		"/(app)/instructor": [~6],
		"/(app)/login": [~7],
		"/(app)/logout": [~8],
		"/(app)/register": [~9],
		"/(app)/user/edit": [11],
		"/(app)/user/[id]": [~10]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';