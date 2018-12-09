import {IMimic, Mimic} from "./mimic";
import {Binding, IBinding} from "./binding";
import {path} from "app-root-path";
import nodePath from "path";
import {IWrapper} from "./wrapper";
import {IHelper} from "./helper";
import {RootResolver} from "./root-resolver";
import {IRootResolverConfig} from "./types";

export interface IInitOptions {
  resolveRoot: IRootResolverConfig
}

export type IMatcher = string | RegExp | ((path: string) => boolean);

const defaultOptions: IInitOptions = {
  resolveRoot: {
    enabled: true,
    prefix: '~'
  }
};

export interface ICore {
  rootPath: string;
  mimic: (matcher: IMatcher, target: string) => IMimic;
  bind: (matcher: IMatcher, target: any) => IBinding;
  setRoot: (path: string) => void;
}

export class Core implements ICore {
  rootPath: string = path;
  private wrapper: IWrapper;
  private helper: IHelper;
  private options: IInitOptions;

  constructor(wrapper: IWrapper, helper: IHelper, options?: IInitOptions) {
    this.wrapper = wrapper;
    this.options = Object.assign(defaultOptions, options);
    this.helper = helper;
    this.addInternalPlugins();
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

  private addInternalPlugins() {
    this.wrapper.addPlugin(new RootResolver(this.wrapper, this.helper, this.options.resolveRoot, this));
  }
}


