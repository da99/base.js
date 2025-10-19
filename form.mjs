
import { dispatch } from './on.js';
import { upsert_id } from './dom.mts';
import { status as style_status } from './css.mts';
import { warn } from './log.mts';

const THIS_ORIGIN = (new URL(window.location.href)).origin;

// import type { Request_Origin, Response_Origin } from './types.mts';

export function data(form_ele) {
  const raw_data = new FormData(form_ele);
  const data = {};
  for (let [k,v] of raw_data.entries()) {
    if (data.hasOwnProperty(k)) {
      if(!Array.isArray(data[k]))
        data[k] = [data[k]];
      data[k].push(v);
    } else
      data[k] = v;
  }
  return data;
} // export function

export function path_to_url(x) {
  if (typeof x !== 'string')
    return false;

  return new URL(x, THIS_ORIGIN);
} // func

function GET(form_ele, action) {
    return fetch_form('GET', form_ele);
};

function POST(form_ele, action) {
    return fetch_form('POST', form_ele);
};

function fetch_form(method, form_ele) {
    const f_data = data(form_ele);
    const action = form_ele.getAttribute('action') || '/';
    const url    = path_to_url(form_ele.getAttribute('action'));

    const fetch_data = {
      method,
      cache         : "no-cache",
      referrerPolicy: "no-referrer",
      headers       : {
        "Content-Type": "application/json",
        X_SENT_FROM: form_ele.id
      },
      body: JSON.stringify(f_data || {})
    };

    const req_origin = {
      request: fetch_data,
      dom_id : form_ele.id,
      action : raw_action
    };

    dispatch(`request`, req_origin);

    style_status.update(dom_id, 'loading');

    setTimeout(async () => {
      fetch(url, fetch_data)
      .then((resp) => response(req_origin, resp))
      .catch((err) => network_error(err, req_origin));
    }, 450);

    return true;
}

async function response(req, raw_resp) {
  if (!raw_resp.ok)
    return dispatch.server_error(req, raw_resp);

  const resp = (await raw_resp.json());

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

  dispatch('response', {response: resp, request: req});

  if (e)
    style_status.update(e, resp.status);

  return dispatch.status(resp, req);
}

function status(resp, req) {
  const status = resp.status;
  warn(`STATUS: ${status}: ${req.dom_id} ${req.action}`);
  const detail = {detail: {status, response: resp, request: req}};
  style_status.update(req.dom_id, status);
  dispatch('status', detail);
}

function server_error(req, raw_resp) {
  warn(`!!! Server Error: ${raw_resp.status} - ${raw_resp.statusText}`);

  const detail = {detail: {request: req, response: raw_resp}};
  dispatch('server_error', detail)

  const e = document.getElementById(req.dom_id);
  if (e) {
    style_status.update(e, 'server_error');
    return true;
  }

  return false;
}

function network_error(error, req) {
  warn(`!!! Network error: ${req.dom_id} ${req.action}: ${error.message}`);
  warn(error);

  const detail = {detail: {error, request}};
  dispatch('network_error', detail);

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

    if (!form_ele.id)
      upsert_id(form_ele);

    POST(form_ele);

    return false;
  });
} //

