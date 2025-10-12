
import { is_num } from './is.mts';


export function repeat(num: number, func: ((i?: number) => void)) {
  for (var i = 0; i < num; i++) {
    func(i);
  }
  return true;
} // func

export function wait_max_seconds(seconds: numer, func: Function) {
    let max      = seconds * 1000;
    let current  = 0;
    let interval = 150;

    function reloop() {
      current = current + interval;
      if (func())
        return true;
      if (current >= max)
        throw new Error('Timeout exceeded: ' + DA.inspect(func) );
      else
        setTimeout(reloop, interval);
    }
    reloop();
};
