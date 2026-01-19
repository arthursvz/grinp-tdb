/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Types } from "../components/MediaQuery.types";
import { getType } from "./getType";
export class MQL {
    static get(query) { return window.matchMedia(query); }
    static inline(query) { return MQL.get(query); }
    //@ts-ignore
    static array(queries) { return queries.map(query => autoMQL(query)); } //recursion :(
    static object(query) {
        const res = {};
        for (const key in query) {
            //@ts-ignore
            res[key] = autoMQL(query[key]);
        }
        return res;
    }
}
export function autoMQL(query) {
    const type = getType(query);
    //@ts-ignore
    if (type === Types.string)
        return MQL.inline(query);
    //@ts-ignore
    if (type === Types.array)
        return MQL.array(query);
    //@ts-ignore
    if (type === Types.object)
        return MQL.object(query);
}
