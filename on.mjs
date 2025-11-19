
const WHITESPACE = /\s+/g;
const SPACE = ' ';

function standard_name(x) { return x.trim().replaceAll(WHITESPACE, SPACE); }

export function on(raw_name, f) {
  document.body.addEventListener(standard_name(raw_name), f);
}

export function before(model_name, f) { return on(`before ${model_name}`, f); };
export function after(model_name, f) { return on(`after ${model_name}`,  f); };
export function network_error(model_name, f) { return on(`network_error ${model_name}`, f); };
export function server_error(model_name, f) { return on(`server_error ${model_name}`, f); };
export function submit(model_name, f) { return on(`submit ${model_name}`,    f); };
export function request(model_name, f) { return on(`request ${model_name}`,   f); };
export function response(model_name, f) { return on(`response ${model_name}`,  f); };
export function ok(model_name, f) { return on(`ok ${model_name}`,        f); };
export function invalid(model_name, f) { return on(`invalid ${model_name}`,   f); };
export function try_again(model_name, f) { return on(`try_again ${model_name}`, f); };
export function not_yet(model_name, f) { return on(`not_yet ${model_name}`,   f); };
export function expired(model_name, f) { return on(`expired ${model_name}`,   f); };

export function dispatch(raw_name, data) {
  const model_name = standard_name(raw_name);
  const asterisk   = {detail: {model_name, ...data}};
  const main       = {detail: data};

  document.body.dispatchEvent(new CustomEvent(`before *`, asterisk));
  document.body.dispatchEvent(new CustomEvent(`before ${model_name}`, main));
  document.body.dispatchEvent(new CustomEvent('*', asterisk));
  const result = document.body.dispatchEvent(new CustomEvent(model_name, main));
  document.body.dispatchEvent(new CustomEvent(`after ${model_name}`, main));
  document.body.dispatchEvent(new CustomEvent(`after *`, asterisk));
  return result;
};



dispatch.before        = function (model_name, f) { return dispatch(`before ${model_name}`, f); };
dispatch.after         = function (model_name, f) { return dispatch(`after ${model_name}`,  f); };
dispatch.network_error = function (model_name, f) { return dispatch(`network_error ${model_name}`, f); };
dispatch.server_error  = function (model_name, f) { return dispatch(`server_error ${model_name}`, f); };
dispatch.submit        = function (model_name, f) { return dispatch(`submit ${model_name}`,    f); };
dispatch.request       = function (model_name, f) { return dispatch(`request ${model_name}`,   f); };
dispatch.response      = function (model_name, f) { return dispatch(`response ${model_name}`,  f); };
dispatch.ok            = function (model_name, f) { return dispatch(`ok ${model_name}`,        f); };
dispatch.invalid       = function (model_name, f) { return dispatch(`invalid ${model_name}`,   f); };
dispatch.try_again     = function (model_name, f) { return dispatch(`try_again ${model_name}`, f); };
dispatch.not_yet       = function (model_name, f) { return dispatch(`not_yet ${model_name}`,   f); };
dispatch.expired       = function (model_name, f) { return dispatch(`expired ${model_name}`,   f); };
dispatch.status        = function (model_name, f) { return dispatch(`status ${model_name}`,   f); };
