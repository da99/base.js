
import { expect, test } from "vitest";

import { is_string } from "../src/index.mts";

test("returns true is arg is a string", () => {
  const result = is_string('a');
  expect(result).toBe(true);
});
