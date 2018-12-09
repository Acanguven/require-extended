import {IMatcher} from "./core";


export interface IHelper {
  match: (matcher: IMatcher, input: string) => boolean;
}

export class Helper implements IHelper {
  match(matcher: IMatcher, input: string) {
    if (typeof matcher === 'string') {
      return input === matcher;
    } else if (matcher instanceof RegExp) {
      return matcher.test(input);
    } else if (matcher && {}.toString.call(matcher) === '[object Function]') {
      return matcher(input);
    } else {
      return false;
    }
  };
}
