import {IPlugin, IRootResolverConfig} from "./types";
import {IWrapper} from "./wrapper";
import {IHelper} from "./helper";
import {ICore, IMatcher} from "./core";

export interface IRootResolver extends IPlugin {

}

export class RootResolver implements IRootResolver {
  private config: IRootResolverConfig;
  private core: ICore;
  private readonly wrapper: IWrapper;
  private readonly helper: IHelper;


  constructor(wrapper: IWrapper, helper: IHelper, config: IRootResolverConfig, core: ICore) {
    this.wrapper = wrapper;
    this.helper = helper;
    this.core = core;
    this.config = config;
  }

  resolver(request: string, parent: string, isMain: boolean, next: (...args: any[]) => any, restart: (...args: any[]) => any) {
    if (request[0] === this.config.prefix && this.config.enabled) {
      return restart(`${this.core.rootPath}${request[1] !== '/' ? '/' : ''}${request.slice(1)}`, parent, isMain);
    }

    return next(request, parent, isMain);
  }
}
