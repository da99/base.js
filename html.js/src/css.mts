
import { CSS_States } from './types.mts';

export const css = {
  by_selector: {
    do(f: (e: Element) => void, selector: string) {
      document.querySelectorAll(selector).forEach(f)
      return selector;
    },

    hide(s: string) { css.by_selector.do(css.by_element.hide, s); },
    unhide(s: string) { css.by_selector.do(css.by_element.unhide, s); },

    reset_to(new_class: typeof CSS_States[number], selector: string) {
      css.by_selector.reset(selector);
      css.by_selector.do((e) => e.classList.add(new_class), selector);
    },

    reset(selector: string) {
      css.by_selector.do(css.by_element.reset, selector);
    }
  },

  by_id: {
    do(f: (e: Element) => void, id: string) {
      const e = document.getElementById(id);
      if (e)
        f(e);
      return id;
    },
    hide(id: string) { css.by_id.do(css.by_element.hide, id); },
    unhide(id: string) { css.by_id.do(css.by_element.unhide, id); },
    reset(id: string) { css.by_id.do(css.by_element.reset, id); },
    reset_to(new_class: typeof CSS_States[number], id: string) {
      css.by_id.reset(id);
      css.by_id.do((e) => e.classList.add(new_class), id);
    }
  },

  by_element: {
    hide(e: Element) { e.classList.add('hide'); },
    unhide(e: Element) { e.classList.remove('hide'); },
    reset(e: Element) {
      for (const s of CSS_States)
        e.classList.remove(s);
    },
    reset_to(new_class: typeof CSS_States[number], e: Element) {
      css.by_element.reset(e);
      e.classList.add(new_class);
    }
  }

}; // export const
