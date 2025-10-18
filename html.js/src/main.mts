
export const SPLIT_ID_CLASS_VALID_PATTERN = /^([\.\#][a-z0-9\_\-]+)+$/
export const VALID_RELATIVE_URL           = /^\/[a-zA-Z0-9\.\-\/]+(#[a-z0-9\_\-]+)?$/i
export const VALID_TEMPLATE_URL           = /^\{[A-Z\_0-9]+\}$/
export const X_SENT_FROM                  = "X_SENT_FROM"; /* This is also used for CSRF protection. */

export interface Fields_State {
  [index: string]: string
}

export const HTML_CHARS_REGEX = /[&<>"']/g;
export const HTML_CHARS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

export function is_void_tagname(x: string) {
    switch (x) {
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'embed':
      case 'hr':
      case 'img':
      case 'input':
      case 'link':
      case 'meta':
      case 'param':
      case 'source':
      case 'track':
      case 'wbr':
        return true;
    }
    return false;
} // func

export function split_id_class(new_class: string) {
  if (!new_class.match(SPLIT_ID_CLASS_VALID_PATTERN)) {
    throw new Error(`Invalid characters in id/class: ${new_class}`);
  }

  const classes: string[] = [];
  let id = undefined;

  for (const s of new_class.split('.') ) {
    if (s === '')
      continue;
    if (s.indexOf('#') === 0) {
      id = s.replace('#', '');
      continue;
    }
    classes.push(s);
  } // for

  return {id, classes};
} // func

// html5(
//   e('html', {lang: 'en'},
//     e('head',
//       e('title')
//     ),
//     e('body', )
//   )
// )
export function html5(...eles: BChild[]) {
    return `<!DOCTYPE html><html lang="en">\n${eles.map(e => to_html(e)).join('')}</html>`;
} // func

export function to_html(x: BChild) {
  if (typeof x === 'string')
    return lodash.escape(x);
  else
    return x.to_html();
}

export class Static {
  name: string;
  constructor(raw_name: string) {
    this.name = raw_name;
  }

  get index_mjs() { return  static_url(`/section/${this.name}/index.mjs`) ; }
  get index_html() { return  static_url(`/section/${this.name}/index.html`) ; }
  get index_css() { return  static_url(`/section/${this.name}/index.css`); }

  // static fetch(sPath: string) {
  //   const fin = static_url(c, sPath);
  //   console.log(`-- Fetching: ${fin}`)
  //   return fetch( fin );
  // }
} // class
