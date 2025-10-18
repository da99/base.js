
export const form = {

  invalid_fields(form: HTMLFormElement, fields: { [index: string]: string }) {
    for (const k in fields) {
      const target = form.querySelector(`label[for='${k}'], input[name='${k}']`);
      const fieldset = (target && target.closest('fieldset')) || form.querySelector(`fieldset.${k}`);
      if (fieldset)
        fieldset.classList.add('invalid');
    }
    return form;
  },


  on_click_button(ev: MouseEvent) {
    const ele =  ev.target && (ev.target as Element).tagName && (ev.target as Element);

    if (!ele)
      return false;

    if (ele.tagName !== 'BUTTON')
      return false;

    const button = ele as HTMLButtonElement;

    const form = button.closest('form');
    if (!form) {
      warn('Form not found for: ' + button.tagName);
      return false;
    }

    ev.preventDefault();
    ev.stopPropagation();

    dom.id.upsert(form);

    if (button.classList.contains('submit'))
      return dispatch.form.submit(form);

    if (button.classList.contains('reset'))
      return dispatch.form.reset(form);

    if (button.classList.contains('cancel'))
      return dispatch.form.cancel(form);

    warn(`Unknown action for form: ${form.id}`);
    return false;
  }, // === function

  event_allow_only_numbers(event: Event) {
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
  },

  input_only_numbers(selector: string) {
    return document.querySelectorAll(selector).forEach(
      e => e.addEventListener('keydown', form.event_allow_only_numbers)
    );
  } // === function
}; // export const
