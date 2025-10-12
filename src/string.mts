
export const WHITESPACE_PATTERN     = /\s+/;

export const BEGIN_DOT_SLASH        = /^\.+\/+/;
export const END_SLASH              = /\/+$/;
export const MULTI_DOT              = /\.+/g;
export const INVALID_FILE_NAME_CHAR = /[^a-z0-9\.\-\_]+/g;
export const MB                     = 1024 * 1024;

function length_not_zero(x: {length: number}): boolean {
  return x.length != 0;
} // function

export function path_to_filename(s: string, replace: string = '.') {
  return s
  .replace(BEGIN_DOT_SLASH, '')
  .replace(END_SLASH, '')
  .replaceAll(INVALID_FILE_NAME_CHAR, replace)
  .replaceAll(MULTI_DOT, '.');
}

export function trim(x: string): string {
  return x.trim();
} // function

export function squeeze_whitespace(s: string) {
  return s.trim().replaceAll(WHITESPACE_PATTERN, ' ');
} // function

export function split_lines(s: string) {
  return s.trim().split('\n');
} // export function

export function compact_lines(x: string, n: number) : string {
  return x.replaceAll(new RegExp(`\\n{${n},}`, "g"), "\n");
} // function

export function split_join(str: string, join: string = " ") {
  return split_whitespace(str).join(join);
} // function

export function string_to_array(x: string | string[]) {
  if (Array.isArray(x))
    return x;
  return split_whitespace(x);
} // export function

export function split_whitespace(x: string) {
  // The .split method call will not create any null values in the
  // returned array. So no need to filter out null values.
  // We just need to filter out empty strings.
  return x
  .trim()
  .split(WHITESPACE_PATTERN)
  .map(trim)
  .filter(length_not_zero);
} // function

export function UP_CASE(s: string) {
  return s.toUpperCase();
} // export function

export function lower_case(s: string) {
  return s.toLowerCase();
} // export function

export function to_var_name(val: string, delim: string) {
  return val.replace(/^[^a-zA-Z-0-9\_]+/, '').replace(/[^a-zA-Z-0-9\_]+/g, delim);
}

export function to_string(arg: unknown): string {
  if (arg === null)
    return 'null';

  if (arg === undefined)
    return 'undefined';

  if (typeof(arg) === 'function')
    return arg.toString().replace(`function (){return(`, "").replace(/\)?;\}$/, '');

  if (arg === true)
    return 'true';

  if (arg === false)
    return 'false';

  if (typeof(arg) === 'string') {
    return '"' + arg + '"';
  }

  if (is_error(arg))
    return '[Error] ' + to_string(arg.message);

  if (typeof arg === "object" ) {

    if (is_array(arg)) {
      let fin: string[] = [];
      for ( const x in arg ) {
        fin.push(to_string(x));
      }
      return "[" + fin.join(",") + "]";
    }

    if (is_plain_object(arg)) {
      let fin: string[] = [];
      for(const x in arg as Record<string, unknown>) {
        if (arg.hasOwnProperty(x))
          fin.push(to_string(x) + ":" + to_string(arg[x]));
      }

      let fin_str = "{" + fin.join(",") + "}";
      return fin_str;
    }
  }

  return arg.toString();
} // === string to_string


