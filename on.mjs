
const WHITESPACE = /\s+/g;
const SPACE = ' ';

function standard_name(x) { return x.trim().replaceAll(WHITESPACE, SPACE); }

export function on(raw_name, f) {
  document.body.addEventListener(standard_name(raw_name), function(evt) {
    f(evt.detail, evt);
  });
}

on.before        = function (model_name, f) { return on(`before ${model_name}`, f); };
on.after         = function (model_name, f) { return on(`after ${model_name}`,  f); };
on.network_error = function (model_name, f) { return on(`network_error ${model_name}`, f); };
on.server_error  = function (model_name, f) { return on(`server_error ${model_name}`, f); };
on.submit        = function (model_name, f) { return on(`submit ${model_name}`,    f); };
on.request       = function (model_name, f) { return on(`request ${model_name}`,   f); };
on.response      = function (model_name, f) { return on(`response ${model_name}`,  f); };
on.ok            = function (model_name, f) { return on(`ok ${model_name}`,        f); };
on.invalid       = function (model_name, f) { return on(`invalid ${model_name}`,   f); };
on.try_again     = function (model_name, f) { return on(`try_again ${model_name}`, f); };
on.not_yet       = function (model_name, f) { return on(`not_yet ${model_name}`,   f); };
on.expired       = function (model_name, f) { return on(`expired ${model_name}`,   f); };

export function dispatch(raw_name, the_data) {
  const model_name = standard_name(raw_name);
  const asterisk   = {detail: {name: model_name, data: the_data}};
  const main       = {detail: the_data};

  document.body.dispatchEvent(new CustomEvent(`before *`, asterisk));
  document.body.dispatchEvent(new CustomEvent(`before ${model_name}`, main));
  document.body.dispatchEvent(new CustomEvent('*', asterisk));
  const result = document.body.dispatchEvent(new CustomEvent(model_name, main));
  document.body.dispatchEvent(new CustomEvent(`after ${model_name}`, main));
  document.body.dispatchEvent(new CustomEvent(`after *`, asterisk));
  return result;
};



