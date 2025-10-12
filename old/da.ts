
import {contentType} from "https://deno.land/x/media_types/mod.ts";
import * as o_path from "https://deno.land/std/path/mod.ts";

export type Conditional = (x: any) => boolean;

export const BEGIN_DOT_SLASH        = /^\.+\/+/;
export const END_SLASH              = /\/+$/;
export const MULTI_DOT              = /\.+/g;
export const INVALID_FILE_NAME_CHAR = /[^a-z0-9\.\-\_]+/g;
export const MB                     = 1024 * 1024;

export function throw_if_null<T>(x: null | T, msg: string): T {
  if (x === null)
    throw new Error(msg);
  return x;
} // export function

// =============================================================================
// Network-related:
// =============================================================================

export function env_or_throw(k: string): string {
  const x: string | undefined = Deno.env.get(k);
  if (!x)
    throw new Error(`environment variable not found: ${Deno.inspect(k)}`);
  return x;
} // export function

export function content_type(filename: string): string {
  return contentType(o_path.basename(filename)) || "application/octet-stream";
} // export function

// =============================================================================
// String-related:
// =============================================================================


// =============================================================================
// Array-related:
// =============================================================================
export function length_not_zero(x: {length: number}): boolean {
  return x.length != 0;
} // function

export function map_length(arr: any[][]) {
  return arr.map(x => x.length);
} // export function

export function sum(arr: number[]) {
  return arr.reduce((p,c) => p + c, 0);
} // export function

export function max(arr: number[]): number {
  if (arr.length === 0)
    throw new Error(`max can't be found: Array empty.`);
  return arr.reduce(
    (prev, curr) => ((curr > prev) ? curr : prev),
     0
  );
} // export function

export function head_indexes(target: any[], n: number): number[] {
  const length        = target.length;
  const fin: number[] = [];
  for (let i = 0; i < n && i < length; i++) {
    fin.push(i);
  }
  if (fin.length === 0)
    throw new Error(`Invalid values for head_indexes(.length ${length}, ${n})`);
  return fin;
} // export function

export function tail_indexes(target: any[], n: number): number[] {
  const length        = target.length;
  const max_index     = length - 1;
  const fin: number[] = [];
  for (let i = 0; i < n && (max_index - i) > -1; i++) {
    fin.unshift(max_index - i);
  }
  if (fin.length === 0)
    throw new Error(`Invalid values for tail_indexes(.length ${length}, ${n})`);
  return fin;
} // export function

export function zip(...arrs: Array<any[]>) {
  const lengths = arrs.map(x => x.length)
  if (lengths.length === 0)
    throw new Error(`No arrays available to be joined.`);
  if (!is.all_equal(lengths))
    throw new Error(`Arrays can't be join. Different lengths.`);
  if (lengths[0] === 0)
    throw new Error(`Empty arrays can't be combined/zipped: zip(${Deno.inspect(arrs).replaceAll(/^\[|\]$/g, '')})`);
  const col_count = lengths[0];
  const cols = [];
  for (let x = 0; x < col_count; ++x) {
    const row = [];
    for (const a of arrs)
      row.push(a[x]);
    cols.push(row);
  }
  return cols;
} // export function

// =============================================================================
// Number-related:
// =============================================================================

export function human_bytes(n: number): string {
  const bytes = n;
  if (bytes < 1024)
    return `${n} B`;
  if (bytes < MB)
    return `${Math.round(bytes/1024)} KB`;
  return `${Math.round(bytes/MB)} MB`;
} // export function

export function count(n: number): number[] {
  const fin: number[] = [];
  if (n < 1)
    throw new Error(`Invalid number for: count(${Deno.inspect(n)})`);
  for (let i = 0; i < n; i++) {
    fin.push(i);
  }
  return fin;
} // export function

export function count_start_end(start: number, end: number): number[] {
  if (start > end)
    return count_start_end(end, start).reverse();

  const fin: number[] = [];
  for (let i = start; i <= end; ++i) {
    fin.push(i);
  }
  return fin;
} // export function

export function tail_count(n: number, end_count: number): number[] {
  const fin: number[] = [];
  const max_index = end_count - 1;
  if (n < 1)
    throw new Error(`Invalid number for: tail_count(${n}, ${end_count})`);
  if (end_count < 1)
    throw new Error(`Invalid end number for: tail_count(${n}, ${end_count})`);
  for (let i = 0; i < n && (max_index - i) > -1; ++i) {
    fin.unshift(max_index - i);
  }
  return fin;
} // export function

// =============================================================================
// path:
// =============================================================================
export const path = {

  to_filename: function path_to_filename(s: string, replace: string = '.') {
    return s
    .replace(BEGIN_DOT_SLASH, '')
    .replace(END_SLASH, '')
    .replaceAll(INVALID_FILE_NAME_CHAR, replace)
    .replaceAll(MULTI_DOT, '.');
  },

  ...o_path
}; // export const path
// =============================================================================

// =============================================================================
// is:
// =============================================================================
export const is = {

};
// === end: is =================================================================

// =============================================================================
// Create functions:
// =============================================================================
export function pipe_function(...funcs : Array<(x: any) => any>) {
  const f_length = funcs.length;
  switch (f_length) {
    case 0: { throw new Error(`No functions provided for: pipe_function(...${Deno.inspect(funcs)})`); } // case
    case 1: { return funcs[0]; }
  } // switch

  return function (x: any) {
    return funcs.reduce(
      (prev, curr) => curr(prev),
      x
    );
  };
} // export function

export function or(...funcs: Conditional[]) : Conditional {
  return function (x: any) {
    for (const f of funcs) {
      if (f(x))
        return true;
    }
    return false;
  };
} // export function

export function and(...funcs: Conditional[]) : Conditional {
  return function (x: any) {
    for (const f of funcs) {
      if (!f(x))
        return false;
    }
    return true;
  };
} // export function

export function not(...funcs: Conditional[]) : Conditional {
  return function (x: any) {
    for (const f of funcs) {
      if (f(x))
        return false;
    }
    return true;
  };
} // export function

export function if_number(f: Function) {
  return function (x: any) {
    if (typeof x === "number")
      return f(x);
    return x;
  }
} // export function

export function if_string(f: Function) {
  return function (x: any) {
    if (typeof x === "string")
      return f(x);
    return x;
  }
} // export function


export function remove_pattern(r: RegExp) {
  return function (s: string) {
    return s.replace(r, '');
  };
} // export function

export function group_by(k: string) {
  return function <T>(arr: Array<Record<string, T>>): Record<string, Record<string, T>> {
    const o = {} as Record<string, Record<string, T>>;
    for (const kv of arr) {
      o['' + kv[k]] = kv;
    } // for
    return o;
  };
} // export function

export function sort_by_key(k: string) {
  return function (a: Record<string, any>, b: Record<string, any>): number {
    let ak = a[k];
    let bk = b[k];
    if (typeof ak !== "number")
      ak = '' + ak;
    if (typeof bk !== "number")
      bk = '' + bk;
    if (ak === bk)
      return 0
    return (ak < bk) ? -1 : 1;
  } // return;
} // export function
