
import { CSS_States } from './types.mts';

export function hide(e: Element) { e.classList.add('hide'); };
export function unhide(e: Element) { e.classList.remove('hide'); };

export function for_each(f: (e: Element) => void, selector: string) {
  const result = document.querySelectorAll(selector)
  result.forEach(f);
  return result;
}

export const status = {
  update: function(e_or_id: string | HTMLElement, new_status: typeof CSS_States[number]): HTMLElement | null {
    const e = status.reset(e_or_id);
    if (e)
      e.classList.add(new_status)
    return e;
  },
  reset: function(e_or_id: string | HTMLElement): HTMLElement | null {
    const ele = (typeof e_or_id === 'string') ? document.querySelector(e_or_id) : e_or_id as HTMLElement;
    if (!ele)
      return ele;

    for (const s of CSS_States)
      ele.classList.remove(s);

    return ele as HTMLElement;
  }
};

