

import type { HTMLAttrs } from './dom.mts';
import { split_id_class, is_void_tagname } from './dom.mts';
import { html as html_escape } from './Escape.mts';
import { is_plain_object } from './IS.mts';

// html5(
//   e('html', {lang: 'en'}, () -> {
//     e('head', e('title'))
//     e('body')
//   })
// )
export function html5(f: (e: typeof element_str) => void) {
  console.log('<!DOCTYPE html><html lang="en">');
  f(element_str)
  console.log('</html>');
} // func

// e('p')
// e('p', '#id.Elem')
// e('p', 'text')
// e('p', '#id.classname', 'text')
// e('p', '#id.classname', f)
// e('p', f)
export function element_str<T extends keyof HTMLElementTagNameMap>(tag_name: T, ...args: (string | HTMLAttrs<T> | ((f: typeof element_str) => void))[]) {
  process.stdout.write(`<${tag_name}`);
  let is_closed = false;
  const is_void = is_void_tagname(tag_name);

  let i = -1;
  const last_i = args.length - 1;
  for (const v of args) {
    i++;

    if (typeof v === 'string' ) {
      if (i === 0 && (v.indexOf('#') === 0 || v.indexOf('.') === 0)) {
        const { id, classes } = split_id_class(v);
        if (id)
          process.stdout.write(` id="${id}"`)
        if (classes.length > 0)
          process.stdout.write(` class="${classes.join(' ')}"`)

        continue;
      }

      if (i === last_i) {
        if (!is_closed) {
          is_closed = true;
          process.stdout.write(`>`);
        }
        process.stdout.write(html_escape(v));
        process.stdout.write(`</${tag_name}>`);
        continue
      }

      throw new Error(`Unknown string: ${v}`);
    } // if string

    if (is_plain_object(v)) {
      for (const attr_k in v) {
        const attr_v = (v as HTMLAttrs<T>)[attr_k as keyof HTMLAttrs<T>];
        const v_type = typeof attr_v;
        if (v_type === 'boolean') {
          if (attr_v)
            process.stdout.write(` ${attr_k}`)
          continue;
        }

        if (v_type === 'string' || v_type === 'number') {
          process.stdout.write(` ${attr_k}="${html_escape(`${attr_v}`)}"`)
          continue;
        }

        if (attr_k === 'data' && is_plain_object(attr_v)) {
          for (const dk in attr_v) {
            process.stdout.write(` data-${dk}="${html_escape(`${attr_v[dk]}`)}"`)
          }
          continue;
        }
      } // for attrs
      continue;
    } // if is_plain_object / attrs

    if (i === last_i && typeof v === 'function') {
      if (is_void)
        throw new Error(`No body allowed for: ${tag_name}`);
      if (!is_closed) {
        is_closed = true;
        process.stdout.write(`>`);
      }
      if (!is_closed) {
        is_closed = true;
        process.stdout.write(`>`);
      }
      (v as ((f: typeof element_str) => void))(element_str);
      continue;
    }

    throw new Error(`Unknown value: ${v}`);
  } // for

  if (!is_closed) {
    process.stdout.write(`>`);
    if (!is_void)
      process.stdout.write(`</${tag_name}>`);
  }
} // export function
