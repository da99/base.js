
export const IS_WINDOW = typeof window === 'object'
export const IS_DEV = IS_WINDOW && (window.location.href.indexOf('://localhost:') > 0 || window.location.href.indexOf('.stream') > 0);

export const EMAIL_PATTERN = /^[^@\.][^@]+@[^@\.]+\.[^@]+[^\.]$/;

export function is_email_valid(x: string) { return !!x.match(EMAIL_PATTERN); }

export const VALID_PROTO = /^(http|https|ssh|ftp|sftp|gopher):\/\//i;

export function is_urlish(x: unknown) {
  if (typeof x !== 'string')
    return false;

  return VALID_PROTO.test(x.toLowerCase());
} // func

export function is_func(x: unknown): x is Function {
  return typeof x === "function";
}


export function is_true(x: any) : x is true {
  return(x === true);
}

export function is_false(x: any) : x is false {
  return(x === false);
}

export function is_boolean(x: unknown): x is boolean {
  return typeof x === 'boolean';
}


export function is_string(x: unknown) : x is string {
  return(typeof x === "string");
}

export  function is_number(x: any) : boolean {
  return(typeof x === "number");
}

export function is_null_or_undefined(x: any) : boolean {
  return(x === null || typeof x === "undefined");
}

export function is_null(x: unknown) : x is null {
  return(x === null);
}


export function is_positive(n: number): boolean {
  return n > -1;
} // export function

function is_all_equal(arr: any[]) {
  if (arr.length === 0)
    throw new Error(`Empty array invalid for: all_equal(${Deno.inspect(arr)})`)

  const init = arr[0];
  for (const x of arr) {
    if (x !== init)
      return false;
  }
  return true;
} // export function

export function is_any(f: (x: any) => boolean) : (x: any[]) => boolean {
  return function (arr: any[]) {
    for (const x of arr) {
      if (f(x))
        return true;
    }
    return false;
  };
} // export function

export function is_length_0(x: {length: number}) : boolean {
  return(x.length === 0);
}

export function is_async_function(x: any) {
  return typeof(x) === "object" && x.constructor.name === "AsyncFunction";
}

export function is_plain_object(x: unknown): boolean {
  return  !!x && typeof x === 'object' && Object.getPrototypeOf(x) === Object.prototype && x.constructor === Object;
}

export function is_object(x: unknown): boolean {
  return typeof(x) === "object";
}

export function is_num(x: unknown): boolean {
  return typeof x === 'number' && !isNaN(x);
}

export function is_dev() {
  if (typeof window === 'undefined')
    return false;

  var addr = window.location.href;
  return window.console && (addr.indexOf("localhost") > 0 || addr.indexOf("127.0.0.1") > 0);
}


export function is_array(x: unknown): boolean {
  return !!x && typeof(x) == "object" && Object.getPrototypeOf(x) === Array.prototype;
}

export function is_regexp(x: unknown): boolean {
  return(x instanceof RegExp);
}


export function is_undefined(x: unknown): x is undefined {
  return typeof(x) === "undefined";
}

export function is_error(x: unknown): boolean {
  return is_object(x) && x.constructor === Error;
}

export function is_empty(x: Record<string, any> | { length: number }) {
  if (is_plain_object(x))
    return Object.keys(x).length === 0;
  return (x as { length: number }).length === 0;
}

export function is_enumerable(v: unknown) {
  return is_string(v) || is_array(v) || is_plain_object(v) ;
}

  // void is_whitespace_specs() {
  //   should_eq(true, bool () { return is_whitespace("   "); });
  //   should_eq(false,bool () { return is_whitespace("");    });
  // }
export function is_whitespace(v: string): boolean {
  if (v.length > 0 && v.trim().length == 0)
    return true;
  return false;
}

  // void standard_name_specs() {
  //   should_eq("name name", string () { return standard_name('NAME NAME'); });  // it 'lowercases names'
  //   should_eq("name",      string () { return standard_name('  name  '); });   // it 'trims string'
  //   should_eq("n ame",     string () { return standard_name('n   aME');  });   // it 'squeezes whitespace'
  // }
export function standard_name(raw: string) {
  return(raw.replace(/[\s\uFEFF\xA0]+/g, ' ').trim()).toLowerCase();
}
