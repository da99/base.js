
import { JSDOM } from 'jsdom';

import { fragment } from '../../dom.mts';
import type { Element_Function } from '../../dom.mts';

export const page = new JSDOM(`<!DOCTYPE html><html lang="en"><head><title></title></head><body></body></html>`)
global.window = page.window;
global.document = page.window.document;

export function to_html(f: ((ef: Element_Function) => void)) {
  const new_fragment = fragment(f);
  document.body.appendChild(new_fragment)
  return page.serialize();
} // func

export function print_html(f: ((ef: Element_Function) => void)) {
  return console.log(to_html(f));
} // func
