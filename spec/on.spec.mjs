
import { expect, test } from 'vitest';
import { on, emit } from '../on.mjs';

test("adds an event handler", function () {
  let x = 0
  on("increase", function (_data, _evt) { x++; });
  emit("increase");
  emit("increase");
  expect(x).toBe(2);
}); // it

test('removes repeating whitespace in event name', function () {
  let x = 'unknown';
  on("   the\t   white    space   ", function (_detail, evt) { x = 'white space normalized'; });

  emit("the white space");
  expect(x).toBe("white space normalized")
}); // test

test('removes repeating whitespace in dispatch event name', function () {
  let x = 'unknown dispatch';
  on("   white   dispatch   ", function (_detail, evt) { x = 'white dispatch'; });

  emit("white dispatch      ");
  expect(x).toBe("white dispatch")
}); // test

test('runs "before" handler', function () {
  let x = 1
  on.before("beforely", function (_data, _evt) { x++; });
  emit("beforely");
  emit("beforely");
  emit("beforely");
  expect(x).toBe(1 + 3)
}); // test

test('runs "after" handler', function () {
  let x = 5
  on.after("afterly", function (_data, _evt) { x++; });
  emit("afterly");
  emit("afterly");
  emit("afterly");
  expect(x).toBe(5 + 3)
}); // test

test('runs "before/main/after" handlers in the right order', function () {
  let stages = [];
  on.after("after-all", function (_data, _evt) { stages.push('after'); })
  on("after-all", function (_data, _evt) { stages.push('main'); })
  on.before("after-all", function (_data, _evt) { stages.push('before'); })

  emit("after-all");

  expect(stages).toStrictEqual(['before', 'main', 'after']);
}); // test

test('passes data to handlers via event.detail', function () {
  let y;
  const x = {"name": "my data"};
  on("dataly", function (evt) { y = evt.detail.name; })
  emit('dataly', x);

  expect(y).toBe(x.name);
}); // test

test('runs * on all handlers', function () {
  let x = 0;
  on('*', function () { x++;});
  emit('something1', null);
  emit('something2', null);
  emit('something3', null);

  expect(x).toBe(0 + 3);
}); // test
