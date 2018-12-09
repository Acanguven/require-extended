import {IMimic, Mimic} from "./mimic";
import {Binding, IBinding} from "./binding";
import {path} from "app-root-path";

interface IInitOptions {

}

export type IMatcher = string | RegExp | ((path: string) => boolean);

export interface ICore {
  rootPath: string;


  init: (options: IInitOptions) => ICore;
  mimic: (matcher: IMatcher) => IMimic;
  bind: (matcher: IMatcher) => IBinding;
  setRoot: (path: string) => void;
}

export class Core implements ICore {
  rootPath: string = path;

  init(options: IInitOptions) {
    return this;
  }

  mimic(matcher: IMatcher) {

    return new Mimic();
  }

  bind(matcher: IMatcher) {

    return new Binding();
  }

  setRoot(path: string) {

  }
}
