
export function fragment(f: ((x: Element_Function) => void)): DocumentFragment {
  let dom_fragment = document.createDocumentFragment();

  let childs: (DocumentFragment | Element)[] = [];
  childs.push(dom_fragment);

  const ele_func = function <T extends keyof ElementTagNameMap>(tag_name: T, ...args: (string | Attrs<T> | Function)[]): Element {
    const new_e = document.createElement(tag_name)
    const prev_e = childs.at(-1);
    if (prev_e)
      prev_e.appendChild(new_e)
    childs.push(new_e)
    finish_element(new_e, ...args);
    childs.pop();
    return new_e;
  }

  f(ele_func);

  return dom_fragment;
} // function

export function do_for_each_element(f: (e: Element) => void, ...args: Array<string | Element>): void {
  const a_max = args.length;
  for (let a_i = 0; a_i < a_max; a_i++) {
    const x = args[a_i];

    if (typeof x === 'string') {
      document.querySelectorAll(x).forEach(f);
      continue;
    }

    f(x);
  }
} // export function

function __plus_one(): number {
  let current_id_count =  document.body.getAttribute('data-id-count') || "-1";
  const new_id = parseInt(current_id_count) + 1;
  document.body.setAttribute('data-id-count', new_id.toString());
  return new_id;
}

export function unique_id() {
  // From: https://twitter.com/SimonHoiberg/status/1503295286264967174
  return Date.now().toString(36) + Math.floor(Math.random() * 100).toString();
} // export function


// Gets id attribute of element.
// Creates an id if it is missing.
export function upsert_id(e: Element): string {
  const id = e.getAttribute('id');
  if (id)
    return id;
  const new_id = `${e.tagName}_${__plus_one()}`
  e.setAttribute('id', new_id);
  return new_id;
}





