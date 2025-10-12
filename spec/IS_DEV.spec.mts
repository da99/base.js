
import { expect, test } from "vitest";
import { IS_DEV } from '../src/is.mts';

test('should be true when the URL is localhost', () => {
  expect(IS_DEV).toBe(true);
});
