
import { expect, test } from "vitest";
import { is_plain_object } from "../src/is.mts";

test('should return true when prototype is Object protoype', function () {
  expect(is_plain_object({a: 'true'})).toBe(true);
});

test('should return false when passed an Array', function () {
  expect(is_plain_object([1,2,3])).toBe(false);
});
