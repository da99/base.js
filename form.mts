
import { emit, emit_request, emit_response, emit_status, emit_submit } from './emit.mts';
import { upsert_id, path_to_url } from './dom.mts';
import { update_status } from './css.mts';
import { warn } from './log.mts';
import type { Request_Origin, Response_Origin } from './types.mts';

// import type { Request_Origin, Response_Origin } from './types.mjs';

const NO_CACHE: RequestCache      = "no-cache";
const NO_REFERRER: ReferrerPolicy = "no-referrer";

const FORMALIZED = "formalized";

function form_init(frm: HTMLFormElement) {
  if (frm.classList.contains(FORMALIZED))
    return frm;

  console.log(`Formalized: ${frm.id}`)
  frm.addEventListener('submit', handle_form_submit_event)
  frm.classList.add(FORMALIZED);
  return frm;
} // function

export function setup() {
  document.body.querySelectorAll('form').forEach(frm => form_init(frm));

  // const is_setup = document.body.classList.contains(FORMALIZED);
  // if (is_setup)
  //   return false;
  //
  // document.body.classList.add(FORMALIZED);
  //
  // return true;
} // function

export function to_data(form_ele: HTMLFormElement) {
  const raw_data = new FormData(form_ele);
  const fin : Record<string, any> = {};
  for (let [k,v] of raw_data.entries()) {
    if (fin.hasOwnProperty(k)) {
      if(!Array.isArray(fin[k]))
        fin[k] = [fin[k]];
      fin[k].push(v);
    } else
      fin[k] = v;
  }
  return fin;
} // export function


export function invalid_fields(form: HTMLFormElement, fields: { [index: string]: string }) {
  for (const k in fields) {
    const target = form.querySelector(`label[for='${k}'], input[name='${k}']`);
    const fieldset = (target && target.closest('fieldset')) || form.querySelector(`fieldset.${k}`);
    if (fieldset)
      fieldset.classList.add('invalid');
  }
  return form;
}


export function event_allow_only_numbers(event: Event) {
  const ev = event as KeyboardEvent;
  switch (ev.key) {
    case '0':
      case '1': case '2': case '3': case '4': case '5':
      case '6': case '7': case '8': case '9':
      true;
    break;
    default:
      ev.stopPropagation();
    ev.preventDefault();
  }
  // do something
}

export function input_only_numbers(selector: string) {
  return document.querySelectorAll(selector).forEach(
    e => e.addEventListener('keydown', event_allow_only_numbers)
  );
} // === function

function handle_form_submit_event(evt: Event) {
  evt.preventDefault();
  evt.stopPropagation();
  evt.stopImmediatePropagation();
  const frm = evt.target as HTMLFormElement;
  if (frm) {
    submit_the_form(frm)
  }
  return frm;
} // function

// function handle_button_submit_event(evt: Event) {
//     const ele = evt.target as HTMLElement;
//     const is_button = ele && ele.tagName == 'BUTTON';
//
//     if (!is_button)
//       return false;
//
//     const button = ele as HTMLButtonElement;
//
//     const parent_form = (button.type == 'submit' || button.classList.contains('submit')) && button.closest('FORM');
//
//     if (!parent_form)
//       return false;
//
//     evt.preventDefault();
//     evt.stopPropagation();
//     evt.stopImmediatePropagation();
//
//     submit_the_form(parent_form as HTMLFormElement)
//     return false;
// } // function

function submit_the_form(form: HTMLFormElement) {
  const raw_action = form.getAttribute('action') || '/';
  const data = to_data(form);
  emit_submit(form.id, data);
  if (raw_action.indexOf('/') !== 0)
    return form;

  fetch_form(form.method || 'POST', form, data);
  return form;
} // function

export function fetch_form(method: string, form_ele: HTMLFormElement, f_data: Record<string, any>) {
  const raw_action = form_ele.getAttribute('action') || '/';
  const url        = path_to_url(raw_action);

  upsert_id(form_ele);

  const request = {
    dom_id : form_ele.id,
    action : raw_action,
    do_request: false,
    request  : {
      method,
      cache         : NO_CACHE,
      referrerPolicy: NO_REFERRER,
      headers       : {
        "Content-Type": "application/json",
        X_SENT_FROM: form_ele.id
      },
      body: JSON.stringify(f_data || {})
    }
  };

  emit_request(request.dom_id, request);

  update_status(form_ele.id, 'loading');

  setTimeout(async () => {
    fetch(url, request.request)
      .then((response) => run_response(request, response))
      .catch((error) => run_network_error(error, request));
  }, 450);

  return true;
} // fetch_form

async function run_response(request: Request_Origin, response: Response) {

  if (!response.ok) { // There was an HTTP error.
    emit_response(request.dom_id, {request, response, json: {}});
    return response;
  }

  const json = (await response.json());

  const x_sent_from = response.headers.get('X_SENT_FROM');

  if (!x_sent_from) {
    warn(`X_SENT_FROM key not found in headers: ${Array.from(response.headers.keys()).join(', ')}`);
    return response;
  }

  if(x_sent_from !== request.dom_id) {
    warn(`X_SENT_FROM and dom id origin do not match: ${x_sent_from} !== ${request.dom_id}`);
    return json;
  }

  emit_response(request.dom_id, {request, response, json});
  return response;
} // async run_response

// function run_not_ok(data: Record<string, any>) {
//   const {request, response} = data;
//   emit_not_ok(data);
//
//   const e = document.getElementById(request.dom_id);
//   if (e) {
//     style_status.update(e, 'server_error');
//     return true;
//   }
//
//   return false;
// }

function run_network_error(error: Error, request: Request_Origin) {
  warn(`!!! Network error: ${request.dom_id} ${request.action}: ${error.message}`);
  warn(error);

  emit(`network_error ${request.dom_id}`, {error, request});

  return update_status(request.dom_id, 'network_error');
} // === function

