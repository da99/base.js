
import { CSS_States } from './types.mts';

export function hide(e: Element) { e.classList.add('hide'); };
export function unhide(e: Element) { e.classList.remove('hide'); };

export function for_each(selector: string, f: (e: Element) => void) {
  const result = document.querySelectorAll(selector)
  result.forEach(f);
  return result;
}

export function update_status(e_or_id: string | HTMLElement, new_status: typeof CSS_States[number]): HTMLElement | null {
  const e = reset_status(e_or_id);
  if (e)
    e.classList.add(new_status)
  return e;
}

export function reset_status(e_or_id: string | HTMLElement): HTMLElement | null {
  const ele = (typeof e_or_id === 'string') ? document.querySelector(e_or_id) : e_or_id as HTMLElement;
  if (!ele)
    return ele;

  for (const s of CSS_States)
    ele.classList.remove(s);

  return ele as HTMLElement;
}

