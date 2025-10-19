
import { dispatch } from './on.js';
import { upsert_id } from './dom.mts';
import { css } from './css.mts';
import { warn } from './log.mts';

const THIS_ORIGIN = (new URL(window.location.href)).origin;

// import type { Request_Origin, Response_Origin } from './types.mts';

import { http } from './http.mts';
import { css } from './css.mts';
import { warn } from 'base.js/src/log.mts';

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

function POST(form_ele, action) {
    return fetch_form('POST', form_ele);
};

function fetch_form(method, form_ele) {
    const f_data = data(form_ele);
    const action = path_to_url(form_ele.getAttribute('action'));

    const fetch_data = {
      method,
      referrerPolicy: "no-referrer",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        X_SENT_FROM: form_ele.id
      },
      body: JSON.stringify(f_data || {})
    };

    const request = {
      request: fetch_data,
      dom_id: form_ele.id
    };

    dispatch(`request`, request);

    css.by_id.reset_to('loading', dom_id);

    setTimeout(async () => {
      fetch(action, fetch_data)
      .then((resp) => dispatch.response(request, resp))
      .catch((err) => dispatch.network_error(err, request));
    }, 450);

    return true;
};

form: {
  submit(e: HTMLFormElement) {

    return http.fetch(form_id, e.getAttribute('action'), 'POST', form.data(e));
  },

    cancel(e: HTMLFormElement) {
      const data = form.data(e);
      document.body.dispatchEvent(new CustomEvent('* cancel', {detail: data}));
      document.body.dispatchEvent(new CustomEvent(`${e.id} cancel`, {detail: data}));
      return true;
    },

    reset(e: HTMLFormElement) {
      const data = form.data(e);
      document.body.dispatchEvent(new CustomEvent('* reset', {detail: data}));
      document.body.dispatchEvent(new CustomEvent(`${e.id} reset`, {detail: data}));
      return true;
    }
},

  request(req: Request_Origin) {
    document.body.dispatchEvent(new CustomEvent('* request', {detail: req}));
    document.body.dispatchEvent(new CustomEvent(`${req.dom_id} request`, {detail: req}));
  },

  async response(req: Request_Origin, raw_resp: Response) {
    if (!raw_resp.ok)
      return dispatch.server_error(req, raw_resp);

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
      css.by_id.reset(req.dom_id);

    return dispatch.status(resp, req);
  },

  status(resp: Response_Origin, req: Request_Origin) {
    const status = resp.status;
    const detail = {detail: {response: resp, request: req}};
    css.by_id.reset_to(status, req.dom_id);
    document.body.dispatchEvent(new CustomEvent(`* ${status}`, detail));
    document.body.dispatchEvent(new CustomEvent(`${req.dom_id} ${status}`, detail));
  },

  server_error(req: Request_Origin, raw_resp: Response) {
    warn(`!!! Server Error: ${raw_resp.status} - ${raw_resp.statusText}`);

    const e = document.getElementById(req.dom_id);
    if (e) {
      css.by_element.reset_to('server_error', e);
      const detail = {detail: {request: req, response: raw_resp}};
      document.body.dispatchEvent(new CustomEvent('* server_error', detail));
      document.body.dispatchEvent(new CustomEvent(`${e.id} server_error`, detail));
      return true;
    }
    return false;
  },

  network_error(error: any, request: Request_Origin) {
    warn(error);
    warn(`!!! Network error: ${error.message}`);
    const detail = {detail: {error, request}};
    document.body.dispatchEvent(new CustomEvent('* network_error', detail));
    document.body.dispatchEvent(new CustomEvent(`${request.dom_id} network_error`, detail));

    const e = document.getElementById(request.dom_id);
    if (e) {
      css.by_element.reset_to('network_error', e);
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

