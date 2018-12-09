import {IMimic, Mimic} from "./mimic";
import {Binding, IBinding} from "./binding";
import {path} from "app-root-path";
import nodePath from "path";
import {IWrapper} from "./wrapper";
import {IHelper} from "./helper";

export interface IInitOptions {

}

export type IMatcher = string | RegExp | ((path: string) => boolean);

export interface ICore {
  wrapper: IWrapper;
  rootPath: string;
  mimic: (matcher: IMatcher, target: string) => IMimic;
  bind: (matcher: IMatcher, target: any) => IBinding;
  setRoot: (path: string) => void;
}

export class Core implements ICore {
  rootPath: string = path;
  wrapper: IWrapper;
  private helper: IHelper;

  constructor(wrapper: IWrapper, helper: IHelper, options?: IInitOptions) {
    this.wrapper = wrapper;
    this.helper = helper;
    this.wrapper.wrapModule();
  }

  mimic(matcher: IMatcher, target: string): IMimic {
    const mimic = new Mimic(this.wrapper, this.helper, matcher, target);
    this.wrapper.addPlugin(mimic);
    return mimic;
  }

  bind(matcher: IMatcher, target: any) {
    const binding = new Binding(this.wrapper, this.helper, matcher, target);
    this.wrapper.addPlugin(binding);
    return binding;
  }

  setRoot(path: string) {
    if (nodePath.isAbsolute(path)) {
      this.rootPath = path;
    } else {
      const err = new Error();
      const callerFileStack = (err.stack as string).split('at ')[2];
      const callerFileMatch = callerFileStack.match(/\((.*?):\d+:\d+\)/) as string[];
      this.rootPath = nodePath.resolve(nodePath.dirname(callerFileMatch[1]), path);
    }
  }
}


