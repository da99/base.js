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
      for(const x in arg as Record<string, any>) {
        if (arg.hasOwnProperty(x))
          fin.push(to_string(x) + ":" + to_string(arg[x]));
      }

      let fin_str = "{" + fin.join(",") + "}";
      return fin_str;
    }
  }

  return arg.toString();
} // === string to_string


