import {IPlugin} from "./types";
import {IWrapper} from "./wrapper";
import {IHelper} from "./helper";
import {IMatcher} from "./core";

export interface IMimic extends IPlugin {
  target: string;
  restore: () => void;
}

export class Mimic implements IMimic {
  target: string;

  private readonly matcher: IMatcher;
  private readonly wrapper: IWrapper;
  private readonly helper: IHelper;

  constructor(wrapper: IWrapper, helper: IHelper, matcher: IMatcher, target: string) {
    this.wrapper = wrapper;
    this.helper = helper;
    this.matcher = matcher;
    this.target = target;
  }

  resolver(request: string, parent: string, isMain: boolean, next: (...args: any[]) => any, restart: (...args: any[]) => any) {
    if (this.helper.match(this.matcher, request)) {
      return restart(this.target, parent, isMain);
    }

    return next(request, parent, isMain);
  }

  restore() {
    this.wrapper.removePlugin(this);
  }
}
