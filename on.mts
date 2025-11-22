
import { standard_name } from './string.mts';
import type { Custom_Event_Handler } from './types.mts';


export function on(raw_name: string, f: Custom_Event_Handler) {
  return document.body.addEventListener(standard_name(raw_name), function (ev: Event) {
    const cev = ev as CustomEvent;
    return f(cev.detail, cev);
  });
}

export function before(name: string, f: Custom_Event_Handler) { return on(`before ${name}`, f); };
export function after(name: string, f: Custom_Event_Handler) { return on(`after ${name}`,  f); };
export function network_error(name: string, f: Custom_Event_Handler) { return on(`network_error ${name}`, f); };
export function server_error(name: string, f: Custom_Event_Handler) { return on(`server_error ${name}`, f); };
export function submit(name: string, f: Custom_Event_Handler) { return on(`submit ${name}`, f); };
export function request(name: string, f: Custom_Event_Handler) { return on(`request ${name}`,  f); };
export function response(name: string, f: Custom_Event_Handler) { return on(`response ${name}`, f); };
export function ok(name: string, f: Custom_Event_Handler) { return on(`ok ${name}`, f); };
export function invalid(name: string, f: Custom_Event_Handler) { return on(`invalid ${name}`, f); };
export function try_again(name: string, f: Custom_Event_Handler) { return on(`try_again ${name}`, f); };
export function not_yet(name: string, f: Custom_Event_Handler) { return on(`not_yet ${name}`, f); };
export function expired(name: string, f: Custom_Event_Handler) { return on(`expired ${name}`, f); };

