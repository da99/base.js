
import { CSS_States } from './types.mts';
// import { warn } from './log.mts';

function _remove_hide(e: Element) { return e.classList.remove('hide'); }
function    _add_hide(e: Element) { return e.classList.add('hide'); }

export function to_node_list(selector: string): NodeListOf<Element> {
  const e = document.getElementById(selector);
  if (e)
    return document.querySelectorAll(`#${selector}`);
  return document.querySelectorAll(selector);
}


export function unhide(selector : string): NodeListOf<Element> {
  const nl = to_node_list(selector);
  nl.forEach(_remove_hide);
  return nl;
}

export function hide(selector: string): NodeListOf<Element> {
  const nl = to_node_list(selector);
  nl.forEach(_add_hide);
  return nl;
}

export function update_status(selector: string, new_status: typeof CSS_States[number]): NodeListOf<Element> {
  const nl = reset_status(selector);
  nl.forEach(e => e.classList.add(new_status));
  return nl;
}

function _remove_css_states(e: Element) {
  for (const s of CSS_States)
    e.classList.remove(s);
  return e;
}

export function reset_status(selector: string): NodeListOf<Element> {
  const nl = to_node_list(selector);
  nl.forEach(_remove_css_states);
  return nl;
}

