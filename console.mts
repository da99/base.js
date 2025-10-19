

// Colors from: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
export const CODES = {
"BOLD"   : "\x1b[1m",
"RED"    : "\x1b[31m",
"GREEN"  : "\x1b[32m",
"YELLOW" : "\x1b[33m",
'RESET'  : "\x1b[0m"
}; // const

const WHITESPACE = /(\s+)/g;

function standard_keys(raw : string) {
  return raw.split(WHITESPACE).filter((e) => e !== "" );
}

function color(color: string, ...args: string[]) {
  const new_color = standard_keys(color).map((x: string) => CODES[x as keyof typeof CODES]).join(" ");
  return `${new_color}${args.join(" ")}${CODES.RESET}`;
}

function bold(txt: string) {
  return color("BOLD", txt);
}

function green(txt: string) {
  return color("GREEN", txt);
}

function red(txt: string) {
  return color("RED", txt);
}

function yellow(txt: string) {
  return color("YELLOW", txt);
}

green.bold  = function (...args: string[]) { return color("GREEN BOLD", ...args); };
red.bold    = function (...args: string[]) { return color("RED BOLD", ...args); };
yellow.bold = function (...args: string[]) { return color("YELLOW BOLD", ...args); };

