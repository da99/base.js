
import { expect, test } from "vitest";
import { is_urlish } from '../is.mts';

test('should return true when string starts with http://', function () {
  expect(is_urlish('http://k.com.com')).toBe(true);
});

test('should return true when string starts with https://', function () {
  expect(is_urlish('https://k.com.com')).toBe(true);
});

test('should return false when string starts with javascript:', function () {
  expect(is_urlish('javascript://alert')).toBe(false);
});
