
import { standard_name } from './string.mts';
import { warn } from './log.mts';
import { reset_status, update_status } from './css.mts';
import type { Request_Origin } from './types.mts';
import { CSS_States } from './types.mts';

export function emit(event_name: string, dom_id: string, data: Record<string, unknown> | JSON_Response) {
  const s_event_name   = standard_name(event_name);
  const s_dom_id       = standard_name(dom_id);
  const all            = {detail: {event_name: s_event_name, dom_id: s_dom_id, ...data}};
  const all_event_name = {detail: {dom_id: s_dom_id, ...data}};
  const main           = {detail: data};

  document.body.dispatchEvent(new CustomEvent(`before`, all));
  document.body.dispatchEvent(new CustomEvent(`before ${s_event_name}`, all_event_name));
  document.body.dispatchEvent(new CustomEvent(`before ${s_event_name} ${s_dom_id}`, main));
  document.body.dispatchEvent(new CustomEvent('*', all));
  const result = document.body.dispatchEvent(new CustomEvent(`${s_event_name} ${s_dom_id}`, main));
  document.body.dispatchEvent(new CustomEvent(`after ${s_event_name}`, all_event_name));
  document.body.dispatchEvent(new CustomEvent(`after ${s_event_name} ${s_dom_id}`, main));
  document.body.dispatchEvent(new CustomEvent(`after`, all));
  return result;
}

// function emit_raw(dom_id: string, data: Record<string, any>) {
//   return document.body.dispatchEvent(new CustomEvent(standard_name(dom_id), {detail: data}));
// }

// export function emit_before(dom_id: string, data: Record<string, any>) { return emit_raw(`before ${dom_id}`, data); };
// export function emit_after(dom_id: string, data: Record<string, any>) { return emit_raw(`after ${dom_id}`,  data); };

export function emit_submit(dom_id: string, data: Record<string, any>) { return emit('submit', dom_id,    data); };
export function emit_request(dom_id: string, data: Record<string, any>) { return emit('request', dom_id,   data); };

export function emit_ok(dom_id: string, data: Record<string, any>) { return emit('ok', dom_id, data); };
export function emit_invalid(dom_id: string, data: Record<string, any>) { return emit('invalid', dom_id,   data); };
export function emit_try_again(dom_id: string, data: Record<string, any>) { return emit('try_again', dom_id, data); };
export function emit_not_yet(dom_id: string, data: Record<string, any>) { return emit('not_yet', dom_id,   data); };
export function emit_expired(dom_id: string, data: Record<string, any>) { return emit('expired', dom_id,   data); };


// export function response(model_name: string, data: Record<string, any>) { return emit(`response ${model_name}`,  data); };
interface JSON_Response {
  request: Request_Origin,
  response: Response,
  json: Record<string, string | number | Object>
}

export function emit_response(dom_id: string, data: JSON_Response) {
  if (!data.response.ok)
    return emit_status(dom_id, data);

  const x_sent_from = data.response.headers.get('X_SENT_FROM');

  if (!x_sent_from) {
    warn(`X_SENT_FROM key not found in headers: ${Array.from(data.response.headers.keys()).join(', ')}`);
    return data.response;
  }

  if(x_sent_from !== dom_id) {
    warn(`X_SENT_FROM and dom id origin do not match: ${x_sent_from} !== ${dom_id}`);
    return data.response;
  }

  const e = document.getElementById(dom_id);

  emit('response', dom_id, data)

  if (e)
    reset_status(`#${dom_id}`);

  return emit_status(dom_id, data);
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
export function emit_status(dom_id: string, data: JSON_Response) {
  const status = to_status_text(data.response.status, data.json)
  warn(`New status for ${dom_id}: ${status}`)
  update_status(dom_id, status);
  emit(status, dom_id, data);
}

// export function server_error(model_name: string, data: Record<string, any>) { return emit(`server_error ${model_name}`, data); };
export function emit_server_error(dom_id: string, data: JSON_Response) {
  warn(`!!! Server Error: ${data.response.status} - ${data.response.statusText}`);
  warn(data.request)
  warn(data.response)

  const e = document.getElementById(dom_id);
  if (e) {
    update_status(dom_id, 'server_error');
    const detail = {detail: data};
    document.body.dispatchEvent(new CustomEvent('* server_error', detail));
    document.body.dispatchEvent(new CustomEvent(`${e.id} server_error`, detail));
    return true;
  }
  return false;
}

// export function network_error(model_name: string, data: Record<string, any>) { return emit(`network_error ${model_name}`, data); };
export function emit_network_error(dom_id: string, request: Request_Origin, error: Error) {
  warn(`!!! Network error for ${dom_id}/${request.action}: ${error.message}`);
  warn(error);

  emit('network_error', dom_id, {error, request});

  return update_status(dom_id, 'network_error');
} // === function
