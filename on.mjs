
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

export function emit(raw_name, data) {
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



emit.before        = function (model_name, f) { return emit(`before ${model_name}`, f); };
emit.after         = function (model_name, f) { return emit(`after ${model_name}`,  f); };
emit.network_error = function (model_name, f) { return emit(`network_error ${model_name}`, f); };
emit.server_error  = function (model_name, f) { return emit(`server_error ${model_name}`, f); };
emit.submit        = function (model_name, f) { return emit(`submit ${model_name}`,    f); };
emit.request       = function (model_name, f) { return emit(`request ${model_name}`,   f); };
emit.response      = function (model_name, f) { return emit(`response ${model_name}`,  f); };
emit.ok            = function (model_name, f) { return emit(`ok ${model_name}`,        f); };
emit.invalid       = function (model_name, f) { return emit(`invalid ${model_name}`,   f); };
emit.try_again     = function (model_name, f) { return emit(`try_again ${model_name}`, f); };
emit.not_yet       = function (model_name, f) { return emit(`not_yet ${model_name}`,   f); };
emit.expired       = function (model_name, f) { return emit(`expired ${model_name}`,   f); };
emit.status        = function (model_name, f) { return emit(`status ${model_name}`,   f); };
