
import { expect, test } from "vitest";

import { is_string } from "../src/is.mts";

test("returns true is arg is a string", () => {
  expect(is_string('a')).toBe(true);
});
