
import { is_num } from './IS.mts';


export function repeat(num: number, func: ((i?: number) => void)) {
  if (is_num(num))
    throw new Error(`Invalid number: ${num}`);
  for (var i = 0; i < num; i++) {
    func(i);
  }
  return true;
} // func
