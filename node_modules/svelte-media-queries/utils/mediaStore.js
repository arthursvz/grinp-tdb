/* eslint-disable @typescript-eslint/no-empty-function */
import { writable } from "svelte/store";
import { autoCalc } from "./calc";
import { autoMQL } from "./converter";
import { autoMQLEvent, MQLEventMethods } from "./MQLEvent";
export function mediaStore(query) {
    if (typeof window === "undefined")
        return { ...writable(undefined), destroy: () => { } };
    const { subscribe, set } = writable(undefined);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const mql = autoMQL(query);
    const handleChange = () => set(autoCalc(mql));
    handleChange();
    autoMQLEvent(mql, handleChange);
    return {
        subscribe,
        destroy() {
            autoMQLEvent(mql, handleChange, MQLEventMethods.remove);
        }
    };
}
