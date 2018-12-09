import {Core, IInitOptions} from "./core";
import {Wrapper} from "./wrapper";
import {Helper} from "./helper";

const wrapper = new Wrapper();
const helper = new Helper();
let core: Core;

const RequireExtended = (options?: IInitOptions): Core => {
  if (core) return core;

  core = new Core(wrapper, helper, options);

  return core;
};

module.exports = RequireExtended;
