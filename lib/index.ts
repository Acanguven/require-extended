import {Core, IInitOptions} from "./core";
import {Wrapper} from "./wrapper";
import {Helper} from "./helper";

const wrapper = new Wrapper();
const helper = new Helper();

export default (options?: IInitOptions) => new Core(wrapper, helper, options);
