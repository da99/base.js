
import { standard_name } from './string.mts';
import { warn } from './log.mts';
import { reset_status, update_status } from './css.mts';
import type { Request_Origin } from './types.mts';
import { CSS_States } from './types.mts';

export function emit(event_name: string, data: Record<string, unknown>) {
  const s_event_name   = standard_name(event_name);
  const asterisk = {detail: {event_name: s_event_name, ...data}};
  const main     = {detail: data};

  document.body.dispatchEvent(new CustomEvent(`before *`, asterisk));
  document.body.dispatchEvent(new CustomEvent(`before ${s_event_name}`, main));
  document.body.dispatchEvent(new CustomEvent('*', asterisk));
  const result = document.body.dispatchEvent(new CustomEvent(s_event_name, main));
  document.body.dispatchEvent(new CustomEvent(`after ${s_event_name}`, main));
  document.body.dispatchEvent(new CustomEvent(`after *`, asterisk));
  return result;
}

function emit_raw(dom_id: string, data: Record<string, any>) {
  return document.body.dispatchEvent(new CustomEvent(standard_name(dom_id), {detail: data}));
}

export function emit_before(dom_id: string, data: Record<string, any>) { return emit_raw(`before ${dom_id}`, data); };
export function emit_after(dom_id: string, data: Record<string, any>) { return emit_raw(`after ${dom_id}`,  data); };

export function emit_submit(dom_id: string, data: Record<string, any>) { return emit(`submit ${dom_id}`,    data); };
export function emit_request(dom_id: string, data: Record<string, any>) { return emit(`request ${dom_id}`,   data); };

export function emit_ok(dom_id: string, data: Record<string, any>) { return emit(`ok ${dom_id}`, data); };
export function emit_invalid(dom_id: string, data: Record<string, any>) { return emit(`invalid ${dom_id}`,   data); };
export function emit_try_again(dom_id: string, data: Record<string, any>) { return emit(`try_again ${dom_id}`, data); };
export function emit_not_yet(dom_id: string, data: Record<string, any>) { return emit(`not_yet ${dom_id}`,   data); };
export function emit_expired(dom_id: string, data: Record<string, any>) { return emit(`expired ${dom_id}`,   data); };


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

  emit_raw('response *', data)
  emit_raw(`response ${dom_id}`, data)

  if (e)
    reset_status(dom_id);

  return emit_status(dom_id, data);
} // async function

export function to_status_text(response: Response): typeof CSS_States[number] {
  const status_number = response.status;
  switch (status_number) {
    case 200:
      
      return 'ok';
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
  const status = to_status_text(data.response)
  update_status(dom_id, status);
  emit_raw(`${status} *`, data);
  emit_raw(`${status} ${dom_id}`, data);
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
export function emit_network_error(error: any, request: Request_Origin) {
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
