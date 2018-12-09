import {Core, IInitOptions} from "./core";
import {Wrapper} from "./wrapper";
import {Helper} from "./helper";

const wrapper = new Wrapper();
const helper = new Helper();

const RequireExtended = (options?: IInitOptions): Core => new Core(wrapper, helper, options);

module.exports = RequireExtended;
