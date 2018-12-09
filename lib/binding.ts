import {IPlugin} from "./types";
import {IMatcher} from "./core";
import {MATCH_RESULT} from "./enums";
import {IWrapper} from "./wrapper";
import {IHelper} from "./helper";

export interface IBinding extends IPlugin {
  restore: () => void;
  target: any;
}

export class Binding implements IBinding {
  public target: any;

  private readonly matcher: IMatcher;
  private readonly wrapper: IWrapper;
  private readonly helper: IHelper;

  constructor(wrapper: IWrapper, helper: IHelper, matcher: IMatcher, target: any) {
    this.matcher = matcher;
    this.target = target;
    this.helper = helper;
    this.wrapper = wrapper;
  }

  loader(request: string, parent: string, isMain: boolean) {
    return this.helper.match(this.matcher, request) ? this.target : MATCH_RESULT.NO_MATCH;
  }

  restore() {
    this.wrapper.removePlugin(this);
  }
}
