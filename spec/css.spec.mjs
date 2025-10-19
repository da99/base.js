import { status } from '../css.mts';
import { expect, test, beforeEach } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = '';
  const parser = new DOMParser();
  const form = parser.parseFromString('<form id="main_form"></form>', 'text/html')
  document.body.appendChild(form.body.firstChild);
});

function eid(x) {
  return document.getElementById(x);
}

test('status.reset: removes previous class names to classList', function () {
  const e = eid('main_form');
  e.classList.add('random')
  e.classList.add('loading')
  status.reset(e)
  expect(e.classList.toString()).toBe('random')
}); // test

test('status.update: adds to classList', function () {
  status.update('#main_form', 'network_error')
  expect(eid('main_form').classList.toString()).toBe('network_error')
}); // test
