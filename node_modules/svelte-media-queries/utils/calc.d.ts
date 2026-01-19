import { type Matches, type MatchesArray } from "../components/MediaQuery.types";
import type { MQLArray, MQLInline, MQLObject } from "./converter";
export declare class Calc {
    static get(mql: MQLInline): Matches;
    static inline(mql: MQLInline): Matches;
    static array(mql: MQLArray): MatchesArray;
    static object(mql: MQLObject): import("../components/MediaQuery.types").ObjectType<any>;
}
export declare function autoCalc(mql: MQLInline): Matches;
export declare function autoCalc(mql: MQLArray): MatchesArray;
