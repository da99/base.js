
import { expect, test } from "vitest";
import { a } from '../src/html.mts';


test("allows string based id attributes", function () {
  let h = new DA.HTML((new JSDOM()).window);
  h.partial(function () {
    h.a("#alert.red", {href: "/"}, "click here");
  });
  let select_a = h.fragment().querySelector("a");
  let actual = (select_a) ? select_a.getAttribute("id") : null;

  expect(actual).toBe("alert");
}); // it

test("allows string based class attributes", function () {
  let h = new DA.HTML((new JSDOM()).window);
  h.partial(function () {
    h.a("#alert.red.scare", {href: "/"}, "click here");
  });
  let select_a = h.fragment().querySelector("a");
  let actual = (select_a) ? select_a.getAttribute("class") : null;

  expect(actual).toBe("red scare");
}); // it

test("accepts text nodes as strings", function () {
  let h = new DA.HTML((new JSDOM()).window);
  h.partial(function () {
    h.a("#alert.red.scare", {href: "/"}, "click here");
  });
  let select_a = h.fragment().querySelector("a");
  let actual = (select_a) ? select_a.innerHTML : null ;

  expect(actual).toBe("click here");
}); // it
