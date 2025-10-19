
export const page = {
  full_url(x: string): string {
    const url = new URL(location.toString());
    url.pathname = x;
    return url.toString();
  },

  go_to(raw: string) {
    window.location.href = page.full_url(raw);
  },

  reload(seconds?: number) {
    if (typeof seconds !== 'number')
      return window.location.reload();

    if (seconds < 0)
      throw new Error(`!!! Invalid value for reload_in: ${seconds}`);

    setTimeout(page.reload, seconds * 1000);
    return;
  }
};

