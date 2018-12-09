import {MATCH_RESULT} from "./enums";
import {IWrapper} from "./wrapper";

export interface IPlugin {
  resolver?: (request: string, parent: string, isMain: boolean, next: () => any, restart: () => any) => any;
  loader?: (request: string, parent: string, isMain: boolean) => any | MATCH_RESULT;
}
