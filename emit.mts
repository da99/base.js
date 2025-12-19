
import { standard_name } from './string.mts';
import { warn } from './log.mts';
import { css_reset_status, css_status } from './css.mts';
import type { Request_Origin } from './types.mts';
import { CSS_States } from './types.mts';

export function emit(event_name: string, selector: string, data: Record<string, unknown> | JSON_Response) {
  const s_event_name   = standard_name(event_name);
  const s_selector     = standard_name(selector);
  const all            = {detail: {event_name: s_event_name, selector: s_selector, ...data}};
  const all_event_name = {detail: {selector: s_selector, ...data}};
  const main           = {detail: data};

  document.body.dispatchEvent(new CustomEvent(`before * *`, all));
  document.body.dispatchEvent(new CustomEvent(`before ${s_event_name} *`, all_event_name));
  document.body.dispatchEvent(new CustomEvent(`before ${s_event_name} ${s_selector}`, main));
  document.body.dispatchEvent(new CustomEvent('*', all));
  const result = document.body.dispatchEvent(new CustomEvent(`${s_event_name} ${s_selector}`, main));
  document.body.dispatchEvent(new CustomEvent(`after ${s_event_name} *`, all_event_name));
  document.body.dispatchEvent(new CustomEvent(`after ${s_event_name} ${s_selector}`, main));
  document.body.dispatchEvent(new CustomEvent(`after * *`, all));
  return result;
}

// export function emit_before(dom_id: string, data: Record<string, any>) { return emit_raw(`before ${dom_id}`, data); };
// export function emit_after(dom_id: string, data: Record<string, any>) { return emit_raw(`after ${dom_id}`,  data); };

export function emit_submit(selector: string, data: Record<string, any>) { return emit('submit', selector,    data); };
export function emit_request(selector: string, data: Record<string, any>) { return emit('request', selector,   data); };

export function emit_ok(selector: string, data: Record<string, any>) { return emit('ok', selector, data); };
export function emit_invalid(selector: string, data: Record<string, any>) { return emit('invalid', selector,   data); };
export function emit_try_again(selector: string, data: Record<string, any>) { return emit('try_again', selector, data); };
export function emit_not_yet(selector: string, data: Record<string, any>) { return emit('not_yet', selector,   data); };
export function emit_expired(selector: string, data: Record<string, any>) { return emit('expired', selector,   data); };


// export function response(model_name: string, data: Record<string, any>) { return emit(`response ${model_name}`,  data); };
interface JSON_Response {
  request: Request_Origin,
  response: Response,
  json: Record<string, string | number | Object>
}

export function emit_response(selector: string, data: JSON_Response) {
  if (!data.response.ok)
    return emit_status(selector, data);

  const x_sent_from = data.response.headers.get('X_SENT_FROM');

  if (!x_sent_from) {
    warn(`X_SENT_FROM key not found in headers: ${Array.from(data.response.headers.keys()).join(', ')}`);
    return data.response;
  }

  if(selector != x_sent_from) {
    warn(`X_SENT_FROM and dom id origin do not match: ${x_sent_from} !== ${selector}`);
    return data.response;
  }

  emit('response', selector, data)
  css_reset_status(selector);

  return emit_status(selector, data);
} // async function

export function to_status_text(status_number: number, data: Record<string, unknown>): typeof CSS_States[number] {
  switch (status_number) {
    case 200:
      return (data['status'] as typeof CSS_States[number]) || 'server_error';
    case 401:
      return 'unauthorized';
    case 403:
      return 'forbidden';
    case 404:
      return 'not_found';
  }
  return 'server_error';
} // function

// export function status(model_name: string, data: Record<string, any>) { return emit(`status ${model_name}`,   data); };
export function emit_status(selector: string, data: JSON_Response) {
  const status = to_status_text(data.response.status, data.json)
  warn(`New status for ${selector}: ${status}`)
  css_status(status, selector);
  emit(status, selector, data);
}

// export function server_error(model_name: string, data: Record<string, any>) { return emit(`server_error ${model_name}`, data); };
export function emit_server_error(selector: string, data: JSON_Response) {
  warn(`!!! Server Error: ${data.response.status} - ${data.response.statusText}`);
  warn(data.request)
  warn(data.response)

  const e = document.querySelector(selector);
  if (e) {
    css_status('server_error', selector);
    const detail = {detail: data};
    document.body.dispatchEvent(new CustomEvent('* server_error', detail));
    document.body.dispatchEvent(new CustomEvent(`${e.id} server_error`, detail));
    return true;
  }
  return false;
}

// export function network_error(model_name: string, data: Record<string, any>) { return emit(`network_error ${model_name}`, data); };
export function emit_network_error(selector: string, request: Request_Origin, error: Error) {
  warn(`!!! Network error for ${selector}/${request.action}: ${error.message}`);
  warn(error);

  emit('network_error', selector, {error, request});

  return css_status('network_error', selector);
} // === function
