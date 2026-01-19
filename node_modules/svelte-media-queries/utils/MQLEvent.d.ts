import type { MQLAny, MQLArray, MQLInline, MQLObject } from "./converter";
export declare enum MQLEventMethods {
    add = "addEventListener",
    remove = "removeEventListener"
}
export declare class MQLEvent {
    static inline(item: MQLInline, handler?: () => void, method?: MQLEventMethods): void;
    static array(arr: MQLArray, handler?: () => void, method?: MQLEventMethods): void;
    static object(obj: MQLObject, handler?: () => void, method?: MQLEventMethods): void;
}
export declare function autoMQLEvent(mql: MQLAny, handler?: () => void, method?: MQLEventMethods): void;
