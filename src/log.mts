
import { IS_WINDOW, IS_DEV } from './IS.mts'

export function log(...args: any[]) {
  if (!IS_WINDOW || IS_DEV)
    return console.log(...args);
  return false;
}

export function warn(...args: any[]) {
  if (!IS_WINDOW || IS_DEV)
    return console.warn(...args);
  return false;
}
