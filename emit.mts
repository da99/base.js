
import { standard_name } from './string.mts';
import { warn } from './log.mts';
import { reset_status, update_status } from './css.mts';
import type { Request_Origin, Response_Origin } from './types.mts';
import { CSS_States } from './types.mts';

export function emit(raw_name: string, data: Record<string, any>) {
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
}

export function emit_raw(raw_name: string, data: Record<string, any>) {
  const model_name = standard_name(raw_name);
  const main       = {detail: data};

  return document.body.dispatchEvent(new CustomEvent(model_name, main));
}

export function before(model_name: string, data: Record<string, any>) { return emit_raw(`before ${model_name}`, data); };
export function after(model_name: string, data: Record<string, any>) { return emit_raw(`after ${model_name}`,  data); };

export function submit(model_name: string, data: Record<string, any>) { return emit(`submit ${model_name}`,    data); };
export function request(model_name: string, data: Record<string, any>) { return emit(`request ${model_name}`,   data); };

export function ok(model_name: string, data: Record<string, any>) { return emit(`ok ${model_name}`,        data); };
export function invalid(model_name: string, data: Record<string, any>) { return emit(`invalid ${model_name}`,   data); };
export function try_again(model_name: string, data: Record<string, any>) { return emit(`try_again ${model_name}`, data); };
export function not_yet(model_name: string, data: Record<string, any>) { return emit(`not_yet ${model_name}`,   data); };
export function expired(model_name: string, data: Record<string, any>) { return emit(`expired ${model_name}`,   data); };


// export function response(model_name: string, data: Record<string, any>) { return emit(`response ${model_name}`,  data); };
export async function response(req: Request_Origin, raw_resp: Response) {
  if (!raw_resp.ok)
    return server_error(req, raw_resp);

  const resp: Response_Origin = (await raw_resp.json()) as Response_Origin;

  const x_sent_from = raw_resp.headers.get('X_SENT_FROM');

  if (!x_sent_from) {
    warn(`X_SENT_FROM key not found in headers: ${Array.from(raw_resp.headers.keys()).join(', ')}`);
    return resp;
  }

  if(x_sent_from !== req.dom_id) {
    warn(`X_SENT_FROM and dom id origin do not match: ${x_sent_from} !== ${req.dom_id}`);
    return resp;
  }

  const e = document.getElementById(req.dom_id);

  const detail = {detail: {response: resp, request: req}};

  document.body.dispatchEvent(new CustomEvent('* response', detail));
  document.body.dispatchEvent(new CustomEvent(`${req.dom_id} response`, detail));

  if (e)
    reset_status(req.dom_id);

  return status(resp, req);
} // async function

// export function status(model_name: string, data: Record<string, any>) { return emit(`status ${model_name}`,   data); };
export function status(resp: Response_Origin, req: Request_Origin) {
  const status = resp.status as typeof CSS_States[number];
  const detail = {detail: {response: resp, request: req}};
  update_status(req.dom_id, status);
  document.body.dispatchEvent(new CustomEvent(`* ${status}`, detail));
  document.body.dispatchEvent(new CustomEvent(`${req.dom_id} ${status}`, detail));
}

// export function server_error(model_name: string, data: Record<string, any>) { return emit(`server_error ${model_name}`, data); };
export function server_error(req: Request_Origin, raw_resp: Response) {
  warn(`!!! Server Error: ${raw_resp.status} - ${raw_resp.statusText}`);

  const e = document.getElementById(req.dom_id);
  if (e) {
    update_status(req.dom_id, 'server_error');
    const detail = {detail: {request: req, response: raw_resp}};
    document.body.dispatchEvent(new CustomEvent('* server_error', detail));
    document.body.dispatchEvent(new CustomEvent(`${e.id} server_error`, detail));
    return true;
  }
  return false;
}

// export function network_error(model_name: string, data: Record<string, any>) { return emit(`network_error ${model_name}`, data); };
export function network_error(error: any, request: Request_Origin) {
  warn(error);
  warn(`!!! Network error: ${error.message}`);
  const detail = {detail: {error, request}};
  document.body.dispatchEvent(new CustomEvent('* network_error', detail));
  document.body.dispatchEvent(new CustomEvent(`${request.dom_id} network_error`, detail));

  const e = document.getElementById(request.dom_id);
  if (e) {
    update_status(e, 'network_error');
    return true;
  }

  return false;
} // === function
