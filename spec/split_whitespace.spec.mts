
import { expect, test } from "vitest";
import { split_whitespace } from "../string.mts";

test("removes whitespace from beginning, middle, and end", function () {
  const str = "  a  \r\n \t b    c ";
  const actual = split_whitespace(str);
  expect(actual).toStrictEqual("a b c".split(" "));
}); // it

test("splits the value", () => {
  const actual = split_whitespace("e n d");
  expect(actual).toStrictEqual(["e", "n", "d"]);
});

test("splits the value, ignoreding whitespace at the beginning/end.", () => {
  const actual = split_whitespace("  e n d  \t ");
  expect(actual).toStrictEqual(["e", "n", "d"]);
});
