
export const http = {

  // Pass a dom_id or element. If the element has an action= attribute,
  // it passes the info to http.fetch.
  element_fetch(x: string | HTMLElement, data?: { [index: string]: any }) {
    const e = dom.to_element(x);
    if (!e)
      return false;

    const dom_id = dom.id.upsert(e);

    const action = (e.dataset['action'] || '').trim();
    if (action.length < 2)
      throw new Error(`No action/url found on ${dom_id}`);

    const full_action = page.full_url(action);
    const method = (e.dataset['method'] || 'POST').toUpperCase();

    http.fetch(dom_id, full_action, method as 'GET' | 'POST', data)
  },

  fetch(dom_id: string, raw_action: | null | string, method: 'POST' | 'GET', data?: { [index:string]: any}) {

    const action = (raw_action || '').trim();

    if (action.length < 2)
      throw new Error(`action attribute not set for ${dom_id}`);

    const fetch_data: RequestInit = {
      method,
      referrerPolicy: "no-referrer",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        X_SENT_FROM: dom_id
      },
      body: JSON.stringify(data || {})
    };

    const request: Request_Origin = {
      request: fetch_data,
      dom_id: dom_id,
      do_request: true
    };

    dispatch.request(request);

    if (!request.do_request)
      return false;

    const full_action = page.full_url(action);

    css.by_id.reset_to('loading', dom_id);

    setTimeout(async () => {
      fetch(full_action, fetch_data)
      .then((resp: Response) => dispatch.response(request, resp))
      .catch((err: any) => dispatch.network_error(err, request));
    }, 450);

    return true;
  }
}; // export const

