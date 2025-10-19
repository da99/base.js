

import { expect, test } from "vitest";
import { IS_WINDOW } from '../is.mts';

test('should be true when "window" is defined', () => {
  expect(IS_WINDOW).toBe(true);
});
