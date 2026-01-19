export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","inp.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.BbBSjqwZ.js","app":"_app/immutable/entry/app.B8Sq5QTt.js","imports":["_app/immutable/entry/start.BbBSjqwZ.js","_app/immutable/chunks/entry.CEfYAMar.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index._5LYSXs0.js","_app/immutable/entry/app.B8Sq5QTt.js","_app/immutable/chunks/scheduler.C7Wo8M4i.js","_app/immutable/chunks/index.CV8hfPSa.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/(app)/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/api/admin/backfill_owner_responsibles",
				pattern: /^\/api\/admin\/backfill_owner_responsibles\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/backfill_owner_responsibles/_server.ts.js'))
			},
			{
				id: "/api/admin/download_database",
				pattern: /^\/api\/admin\/download_database\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/download_database/_server.ts.js'))
			},
			{
				id: "/api/admin/reset_cotisant_as",
				pattern: /^\/api\/admin\/reset_cotisant_as\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/reset_cotisant_as/_server.ts.js'))
			},
			{
				id: "/api/admin/reset_cotisant_grinp",
				pattern: /^\/api\/admin\/reset_cotisant_grinp\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/reset_cotisant_grinp/_server.ts.js'))
			},
			{
				id: "/api/admin/reset_database",
				pattern: /^\/api\/admin\/reset_database\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/reset_database/_server.ts.js'))
			},
			{
				id: "/api/slots/create",
				pattern: /^\/api\/slots\/create\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/slots/create/_server.ts.js'))
			},
			{
				id: "/api/slots/delete",
				pattern: /^\/api\/slots\/delete\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/slots/delete/_server.ts.js'))
			},
			{
				id: "/api/slots/exists",
				pattern: /^\/api\/slots\/exists\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/slots/exists/_server.ts.js'))
			},
			{
				id: "/api/slots/get",
				pattern: /^\/api\/slots\/get\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/slots/get/_server.ts.js'))
			},
			{
				id: "/api/slots/subscribe",
				pattern: /^\/api\/slots\/subscribe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/slots/subscribe/_server.ts.js'))
			},
			{
				id: "/api/slots/toggle_responsible",
				pattern: /^\/api\/slots\/toggle_responsible\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/slots/toggle_responsible/_server.ts.js'))
			},
			{
				id: "/api/slots/unsubscribe",
				pattern: /^\/api\/slots\/unsubscribe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/slots/unsubscribe/_server.ts.js'))
			},
			{
				id: "/api/slots/update",
				pattern: /^\/api\/slots\/update\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/slots/update/_server.ts.js'))
			},
			{
				id: "/api/users/attendee",
				pattern: /^\/api\/users\/attendee\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/users/attendee/_server.ts.js'))
			},
			{
				id: "/api/users/delete",
				pattern: /^\/api\/users\/delete\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/users/delete/_server.ts.js'))
			},
			{
				id: "/api/users/promote_instructor",
				pattern: /^\/api\/users\/promote_instructor\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/users/promote_instructor/_server.ts.js'))
			},
			{
				id: "/api/users/reset_cotisant_as",
				pattern: /^\/api\/users\/reset_cotisant_as\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/users/reset_cotisant_as/_server.ts.js'))
			},
			{
				id: "/api/users/reset_cotisant_grinp",
				pattern: /^\/api\/users\/reset_cotisant_grinp\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/users/reset_cotisant_grinp/_server.ts.js'))
			},
			{
				id: "/api/users/toggle_admin",
				pattern: /^\/api\/users\/toggle_admin\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/users/toggle_admin/_server.ts.js'))
			},
			{
				id: "/api/users/toggle_cotisant_as",
				pattern: /^\/api\/users\/toggle_cotisant_as\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/users/toggle_cotisant_as/_server.ts.js'))
			},
			{
				id: "/api/users/toggle_cotisant_grinp",
				pattern: /^\/api\/users\/toggle_cotisant_grinp\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/users/toggle_cotisant_grinp/_server.ts.js'))
			},
			{
				id: "/(app)/calendar",
				pattern: /^\/calendar\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/(app)/events",
				pattern: /^\/events\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/(app)/instructor",
				pattern: /^\/instructor\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(app)/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(app)/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/(app)/register",
				pattern: /^\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/(app)/user/edit",
				pattern: /^\/user\/edit\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/(app)/user/[id]",
				pattern: /^\/user\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
