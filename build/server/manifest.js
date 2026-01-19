const manifest = (() => {
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
			__memo(() => import('./chunks/0-DT2NV7Gu.js')),
			__memo(() => import('./chunks/1-DopDoslb.js')),
			__memo(() => import('./chunks/2-V82A_kui.js')),
			__memo(() => import('./chunks/3-CEGQ54hI.js')),
			__memo(() => import('./chunks/4-3gGLRp83.js')),
			__memo(() => import('./chunks/5-CgP1-CzN.js')),
			__memo(() => import('./chunks/6-BbB1m1v6.js')),
			__memo(() => import('./chunks/7-Cm8NLliu.js')),
			__memo(() => import('./chunks/8-DP1uxPmc.js')),
			__memo(() => import('./chunks/9-CZp6n9GI.js')),
			__memo(() => import('./chunks/10-GvMKGzF6.js')),
			__memo(() => import('./chunks/11-Et_jSJo4.js'))
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
				endpoint: __memo(() => import('./chunks/_server.ts-koU_Ana7.js'))
			},
			{
				id: "/api/admin/download_database",
				pattern: /^\/api\/admin\/download_database\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-jsw0jQ0E.js'))
			},
			{
				id: "/api/admin/reset_cotisant_as",
				pattern: /^\/api\/admin\/reset_cotisant_as\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-4S9HeWfe.js'))
			},
			{
				id: "/api/admin/reset_cotisant_grinp",
				pattern: /^\/api\/admin\/reset_cotisant_grinp\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-B1Zrox0W.js'))
			},
			{
				id: "/api/admin/reset_database",
				pattern: /^\/api\/admin\/reset_database\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-Db-jUMHi.js'))
			},
			{
				id: "/api/slots/create",
				pattern: /^\/api\/slots\/create\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DGcC1FJP.js'))
			},
			{
				id: "/api/slots/delete",
				pattern: /^\/api\/slots\/delete\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CX39XB2X.js'))
			},
			{
				id: "/api/slots/exists",
				pattern: /^\/api\/slots\/exists\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-Iwss79IM.js'))
			},
			{
				id: "/api/slots/get",
				pattern: /^\/api\/slots\/get\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DAPiMgRm.js'))
			},
			{
				id: "/api/slots/subscribe",
				pattern: /^\/api\/slots\/subscribe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BMaSQpTS.js'))
			},
			{
				id: "/api/slots/toggle_responsible",
				pattern: /^\/api\/slots\/toggle_responsible\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-D7Xin6zZ.js'))
			},
			{
				id: "/api/slots/unsubscribe",
				pattern: /^\/api\/slots\/unsubscribe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BDunFWlm.js'))
			},
			{
				id: "/api/slots/update",
				pattern: /^\/api\/slots\/update\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DYRuDWXe.js'))
			},
			{
				id: "/api/users/attendee",
				pattern: /^\/api\/users\/attendee\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DR34sSJ7.js'))
			},
			{
				id: "/api/users/delete",
				pattern: /^\/api\/users\/delete\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-9Mhtn2Tl.js'))
			},
			{
				id: "/api/users/promote_instructor",
				pattern: /^\/api\/users\/promote_instructor\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BI1xLBWU.js'))
			},
			{
				id: "/api/users/reset_cotisant_as",
				pattern: /^\/api\/users\/reset_cotisant_as\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-4trRfBSw.js'))
			},
			{
				id: "/api/users/reset_cotisant_grinp",
				pattern: /^\/api\/users\/reset_cotisant_grinp\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-YjU_fL1C.js'))
			},
			{
				id: "/api/users/toggle_admin",
				pattern: /^\/api\/users\/toggle_admin\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-Cb7yMo3Z.js'))
			},
			{
				id: "/api/users/toggle_cotisant_as",
				pattern: /^\/api\/users\/toggle_cotisant_as\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BbD-yp49.js'))
			},
			{
				id: "/api/users/toggle_cotisant_grinp",
				pattern: /^\/api\/users\/toggle_cotisant_grinp\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-sXlwAQyC.js'))
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

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
