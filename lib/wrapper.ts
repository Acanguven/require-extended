import {IPlugin} from "./types";
import {MATCH_RESULT} from "./enums";

const Module = require('module').Module;

export interface IWrapper {
  wrapModule: () => void;
  unwrapModule: () => void;
  addPlugin: (plugin: IPlugin) => void;
  removePlugin: (plugin: IPlugin) => void;
}

export class Wrapper implements IWrapper {
  _resolveFilenameRef = Module._resolveFilename;
  _loadRef = Module._load;
  resolvers: any[] = [];
  loaders: any[] = [];

  addPlugin(plugin: IPlugin) {
    if (plugin.resolver) {
      this.resolvers.push(this.connectPluginToFunction(plugin.resolver, plugin));
    }

    if (plugin.loader) {
      this.loaders.push(this.connectPluginToFunction(plugin.loader, plugin));
    }
  }

  removePlugin(plugin: IPlugin) {
    this.loaders = this.loaders.filter(fn => fn.__plugin !== plugin);
    this.resolvers = this.resolvers.filter(fn => fn.__plugin !== plugin);
  }

  wrapModule() {
    if (Module._require__extended) {
      return Module._require__extended;
    }

    Module._resolveFilename = this._resolveFilename.bind(this);
    Module._load = this._load.bind(this);

    Module._require__extended = this;

    return this;
  }

  unwrapModule() {
    delete Module._require__extended;
    Module._resolveFilename = this._resolveFilenameRef;
    Module._load = this._loadRef;
  }


  _resolveFilename(realRequest: string, realParent: string, realIsMain: boolean) {
    const resolveChain = this.resolvers.map((resolver, i) => {
      return (request: string, parent: string, isMain: boolean) => resolver(
        request,
        parent,
        isMain,
        this.resolvers[i + 1] ? (request: string, parent: string, isMain: boolean) => resolveChain[i + 1](request, parent, isMain) : this._resolveFilenameRef,
        (request: string, parent: string, isMain: boolean) => resolveChain[0](request, parent, isMain)
      );
    });

    if (resolveChain.length === 0) {
      return this._resolveFilenameRef(realRequest, realParent, realIsMain);
    }

    return resolveChain[0](realRequest, realParent, realIsMain);
  }

  _load(request: string, parent: string, isMain: boolean) {
    let match = MATCH_RESULT.NO_MATCH;

    this.loaders.some(loader => {
      const value = loader(request, parent, isMain);
      if (value !== MATCH_RESULT.NO_MATCH) {
        match = value;
        return true;
      }

      return false;
    });

    if (match !== MATCH_RESULT.NO_MATCH) {
      return match;
    }

    return this._loadRef(...arguments);
  }


  private connectPluginToFunction(pluginFunction: any, plugin: IPlugin) {
    const fn = pluginFunction.bind(plugin);
    Object.defineProperty(fn, '__plugin', {
      value: plugin
    });
    return fn;
  }
}
