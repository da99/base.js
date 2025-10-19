
import { dispatch } from './on.js';
import { upsert_id } from './dom.mts';
import { status as style_status } from './css.mts';
import { warn } from './log.mts';

const THIS_ORIGIN = (new URL(window.location.href)).origin;

// import type { Request_Origin, Response_Origin } from './types.mts';

export function path_to_url(x) {
  if (typeof x !== 'string')
    return false;

  return new URL(x, THIS_ORIGIN);
} // func

export function to_data(form_ele) {
  const raw_data = new FormData(form_ele);
  const fin = {};
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

// function GET(form_ele) { return fetch_form('GET', form_ele); };
function POST(form_ele) { return fetch_form('POST', form_ele); };
function fetch_form(method, form_ele) {
  const f_data = to_data(form_ele);
  const action = form_ele.getAttribute('action') || '/';
  const url    = path_to_url(form_ele.getAttribute('action'));

  if (!form_ele.id)
    upsert_id(form_ele);

  const request = {
    dom_id : form_ele.id,
    action : raw_action,
    fetch  : {
      method,
      cache         : "no-cache",
      referrerPolicy: "no-referrer",
      headers       : {
        "Content-Type": "application/json",
        X_SENT_FROM: form_ele.id
      },
      body: JSON.stringify(f_data || {})
    }
  };

  dispatch.request(request.dom_id, request);

  style_status.update(form_ele.id, 'loading');

  setTimeout(async () => {
    fetch(url, request.fetch)
      .then((response) => run_response({request, response}))
      .catch((error) => run_network_error({error, request}));
  }, 450);

  return true;
} // fetch_form

async function run_response(data) {
  const {request, response} = data;
  if (!response.ok) {
    run_server_error(data);
    return data;
  }

  const json = (await response.json());

  const x_sent_from = response.headers.get('X_SENT_FROM');

  if (!x_sent_from) {
    warn(`X_SENT_FROM key not found in headers: ${Array.from(response.headers.keys()).join(', ')}`);
    return resp;
  }

  if(x_sent_from !== request.dom_id) {
    warn(`X_SENT_FROM and dom id origin do not match: ${x_sent_from} !== ${request.dom_id}`);
    return json;
  }

  const e = document.getElementById(request.dom_id);

  dispatch.response(request.dom_id, {json, ...data});


  const status = json.status;
  const new_data = {status, json, ...data};

  if (e)
    style_status.update(e, json.status);

  warn(`STATUS: ${status}: ${request.dom_id} ${request.action}`);
  dispatch.status(request.dom_id, new_data);
  dispatch(`${response.status} ${dom_id}`, new_data);

  return data;
} // async run_response

function run_server_error(data) {
  const {request, response} = data;
  warn(`!!! Server Error: ${response.status} - ${response.statusText}`);

  dispatch('server_error', data);

  const e = document.getElementById(request.dom_id);
  if (e) {
    style_status.update(e, 'server_error');
    return true;
  }

  return false;
}

function run_network_error(data) {
  const {error, request} = data;
  warn(`!!! Network error: ${request.dom_id} ${request.action}: ${error.message}`);
  warn(error);

  dispatch('network_error', data);

  const e = document.getElementById(request.dom_id);
  if (e) {
    style_status.update(e, 'network_error');
    return true;
  }

  return false;
} // === function


export function init() {
  document.body.attachEventListener('click', function (evt) {
    const ele = evt.target;
    const form_ele = ele && ele.tagName == 'BUTTON' && ele.type == 'submit' && ele.closest('FORM')

    if (!form_ele)
      return false;

    if (form_ele.getAttribute('action').indexOf('/') !== 0)
      return false;

    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();

    POST(form_ele);
    return false;
  }); // attachEventListener
} //

