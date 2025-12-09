
export type Element_Function = <T extends keyof ElementTagNameMap>(tag_name: T, ...args: (string | Attrs<T> | Function)[]) => Element;
type ElementBody = ((f: typeof element) => Element | void);

import type { Attrs } from '../../types.mts';

import { split_id_class } from './main.mts';
import { fragment } from '../../dom.mts';
import { is_plain_object } from '../../is.mts';


export function to_element(x: string | HTMLElement): HTMLElement | null {
  if (typeof x === 'string')
    return document.getElementById(x);
  return x;
}

export function title(str: string) {
  const t = document.querySelector('title');
  if (!t)
    throw new Error('title element not found.');
  t.appendChild(document.createTextNode(str));
  return t;
}

export function meta(attrs: Attrs<'meta'>) {
  const h = document.querySelector('head');
  if (h) {
    h.appendChild(element('meta', attrs));
  }
  return h;
}

// export function body_append<T extends keyof ElementTagNameMap>(tag_name: T, ...args: (string | Attrs<T> | ElementBody)[]): Element {
export function body_append(f: ((x: Element_Function) => void)): DocumentFragment {
  const frag = fragment(f);
  document.body.appendChild(frag);
  return frag;
} // function

export function link(attrs: Attrs<'link'>) {
  const h = document.querySelector('head');
  if (h) {
    h.appendChild(element('link', attrs));
  }
  return h;
}

/*
  * e('input', {name: "_something"}, "My Text")
  * e('a', '.red#ID', {href: "https://some.url"}, "My Text")
  * e('div', e('span', "My Text"))
  * e('div', '#main', (e) => {
      e('span', "My Text")
    })
  * e('div', '#main',
  *   e('span', "My Text"),
  *   e('div', "My Text")
  * )
*/
export function element<T extends keyof ElementTagNameMap>(tag_name: T, ...args: (string | Attrs<T> | ElementBody)[]): Element {
  const e = document.createElement(tag_name)

  let i = -1;
  const last_i = args.length - 1;
  for (const v of args){
    i++;

    if (typeof v === 'string') {
      const is_id_class = i === 0 && (v.at(0) === '#' || v.at(0) === '.');

      if (is_id_class) {
        const {id, classes} = split_id_class(v);
        if(id)
          e.setAttribute('id', id);
        for (const x of classes)
          e.classList.add(x)
        continue;
      }

      if (last_i == i) {
        e.appendChild(document.createTextNode(v));
        continue;
      }

      throw new Error(`Invalid string: ${v} i:${i}`);
    } // if string

    if (is_plain_object(v)) {
      __set_attrs(e, v);
      continue;
    }

    if (typeof v === 'function') {
      function ele_func<T extends keyof ElementTagNameMap>(tag_name: T, ...args: (string | Attrs<T> | ElementBody)[]) {
        return e.appendChild(element(tag_name, ...args));
      };
      (v as Function)(ele_func);
    }
  } // if string

  return e;
} // export function


function __set_attrs(ele: Element, attrs: any) {
  for (const k in attrs) {
    switch (k) {
      case 'htmlFor':
      case 'htmlfor':
        ele.setAttribute('for', attrs[k]);
        break;
      case 'href':
        const new_url = (attrs as ElementTagNameMap['a'])[k];
        const first_char = new_url.at(0)
        switch (first_char) {
          case '/':
            if (VALID_RELATIVE_URL.test(new_url))
              ele.setAttribute(k, new_url);
            else
              throw new Error(`Invalid relative url: ${new_url}`)
            break;
          case '{':
            if (VALID_TEMPLATE_URL.test(new_url))
              ele.setAttribute(k, new_url);
            else
              throw new Error(`Invalid template url: ${new_url}`)
            break;
          default:
            try {
              ele.setAttribute(k, (new URL(new_url)).toString());
            } catch (e) {
              warn(`Invalid url: ${new_url}`)
            }
        } // switch
        break;
      default:
        ele.setAttribute(k, attrs[k]);

    } // switch
  }
  return ele;
}


function finish_element<T extends keyof ElementTagNameMap>(e: Element, ...args: (string | Attrs<T> | Function)[]): Element {
  let i = -1;
  const last_i = args.length - 1;
  for (const v of args){
    i++;

    if (typeof v === 'string') {
      const is_id_class = i === 0 && (v.at(0) === '#' || v.at(0) === '.');

      if (is_id_class) {
        const {id, classes} = split_id_class(v);
        if(id)
          e.setAttribute('id', id);
        for (const x of classes)
          e.classList.add(x)
        continue;
      }

      if (last_i == i) {
        e.appendChild(document.createTextNode(v));
        continue;
      }

      throw new Error(`Invalid string: ${v} i:${i}`);
    } // if string

    if (is_plain_object(v)) {
      __set_attrs(e, v);
      continue;
    }

    if (typeof v === 'function') {
      (v as Function)();
    }
  } // if string

  return e;
} // export function
