
/*
  *
  * This version of html.js is for 'build-side rendering.'
  * It is meant for builds, not server or client side rendering.
  */

import type { HTMLAttrs } from './dom.mts';

import { split_id_class, is_void_tagname } from './dom.mts';
import { is_plain_object, is_func } from './IS.mts';
import { html as html_escape } from './Escape.mts';

type BChild = string | BElement<keyof HTMLElementTagNameMap>

class Page_List {
  list: Page[];

  constructor() {
    this.list = [];
  }

  new() {
    this.list.push(new Page());
  }

  current() {
    let c = this.list.at(this.list.length - 1);
    if (!c)
      throw new Error('No current page found.');
    return c;
  }

  pop() {
    return this.list.pop();
  }
} // class

class Page {
  elements: BChild[];
  childs: Array<BChild[]>;

  constructor() {
    this.elements = [];
    this.childs = [];
  }

  push(e: BChild) {
    if (this.childs.length > 0)
      this.childs[this.childs.length - 1].push(e);
    else {
      if (typeof e !== 'string')
        this.elements.push(e);
      else
        throw new Error(`String not allowed in elements list: ${e}`)
    }
    return this;
  }

  collect_childs() {
    this.childs.push([]);
    return this;
  }

  get_childs() {
    if (this.childs.length < 1)
      return [];
    return this.childs.pop();
  }

  to_html() {
    return this.elements.map(x => typeof x !== 'string' && x.to_html()).join('');
  }
} // class Page


class BElement<T extends keyof HTMLElementTagNameMap> {
  tagname: string;
  class_list: string[] | null;
  attrs: HTMLAttrs<T>;
  tagid: undefined | string;
  childs: BChild[];

  constructor(tag_name: keyof HTMLElementTagNameMap, raw_id_class: string, raw_attrs: HTMLAttrs<T>, eles: BChild[]) {
    const { class_list, tag_id } = split_id_class(tag_name, raw_id_class);
    this.tagname = tag_name;
    this.class_list = class_list;
    this.attrs = raw_attrs;
    if (typeof tag_id == 'string')
      this.attrs['id'] = tag_id;
    this.childs = eles;
    if (this.childs.length > 0 && is_void_tagname(this.tagname)) {
      throw `elements of ${this.tagname} may not have child elements.`;
    }
  }

  to_html() {
    let html = `<${this.tagname}`;
    const class_list = this.class_list;

    if (class_list)
      if (class_list.length > 0) {
        html += ` class="${class_list.map(x => html_escape(x)).join(' ')}"`;
      }

    for (const [k,attr_v] of Object.entries(this.attrs)) {
      let new_k = k;
      switch (k.toLowerCase()) {
        case 'htmlfor':
          new_k = 'for';
        break;
      }

      // const attr_v = this.attrs[k as keyof HTMLAttrs<T>];
      switch (typeof attr_v) {
        case 'string':
          html += ` ${new_k}="${html_escape(attr_v)}"`
        break;
        case 'number':
          html += ` ${new_k}="${html_escape(attr_v.toString())}"`
          break;
        case 'object':
          if (k !== 'data')
            throw new Error(`Unknown attribute value type to escape: ${attr_v} -> ${typeof attr_v}`)
          for (const [k,v] of Object.entries(attr_v as Object)) {
            html += ` data-${k}="${html_escape(v.toString())}"`
          }
          break;

        default:
          throw new Error(`Unknown attribute value type to escape: ${attr_v} -> ${typeof attr_v}`)
      }
    } // for

    html += '>';

    if (is_void_tagname(this.tagname))
      return html;

    for (const c of this.childs) {
      if (typeof c === 'string')
        html += html_escape(c);
      else
        html += c.to_html();
    }

    html += `</${this.tagname}>`
    return html;
  }
} // BElement

const PAGES = new Page_List();

/*
  * e('input', {name: "_something"}, "My Text")
  * e('div', e('span', "My Text"))
  * e('div', '#main', () => {
  *   e('span', "My Text"),
  *   e('div', "My Text")
  * })
*/
export function element<T extends keyof HTMLElementTagNameMap>(tag_name: T, ...pieces : (BChild | (() => void) | HTMLAttrs<T>)[]) {
  let attrs: HTMLAttrs<T> = {};
  let id_class: string = '';
  const p = PAGES.current();
  p.collect_childs();

  for (let i = 0; i < pieces.length; i++) {
    const x = pieces[i];

    if (typeof x === "string") {
      if (i == 0 && ((x as string).at(0) == '#' || (x as string).at(0) == '.')) {
        id_class = x;
        continue;
      }

      p.push(x);
      continue;
    }

    if (is_func(x)) {
      (x as () => void)();
      continue;
    }

    if (is_plain_object(x)) {
      attrs = x as HTMLAttrs<T>;
      continue;
    }

    p.push(x as BElement<keyof HTMLElementTagNameMap>);

  } // for

  const new_e = new BElement(tag_name, id_class, attrs || {}, p.get_childs() || []);
  p.push(new_e)
  return new_e;
} // export function

// export function fragment(...eles: (string | Element)[])
//   let dom_fragment = document.createDocumentFragment();
//   return dom_fragment;
