
import { CSS_States } from './types.mts';
// import { warn } from './log.mts';

export function to_node_list(selector: string): NodeListOf<Element> {
  if (selector[0] !== '#') {
    if (document.getElementById(selector))
      return document.querySelectorAll(`#${selector}`);
  }
  return document.querySelectorAll(selector);
}


export function css_remove(classname: string, selector: string): NodeListOf<Element> {
  const nl = to_node_list(selector);
  nl.forEach(e => e.classList.remove(classname));
  return nl;
}

export function css_add(classname: string, selector: string): NodeListOf<Element> {
  const nl = to_node_list(selector);
  nl.forEach(e => e.classList.add(classname));
  return nl;
}

export function css_status(new_status: typeof CSS_States[number], selector: string): NodeListOf<Element> {
  const nl = css_reset_status(selector);
  nl.forEach(e => e.classList.add(new_status));
  return nl;
}

function _remove_css_states(e: Element) {
  for (const s of CSS_States)
    e.classList.remove(s);
  return e;
}

export function css_reset_status(selector: string): NodeListOf<Element> {
  const nl = to_node_list(selector);
  nl.forEach(_remove_css_states);
  return nl;
}

