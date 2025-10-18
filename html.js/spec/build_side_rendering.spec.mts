  describe('html5', function () {
    it('returns a string with a doctype', function () {
      const html = html5(
        BE('html',
          BE('head',
            BE('title', 'hello')
          ),
          BE('body')
        )
      );
      assert.equal(html, `<!DOCTYPE html>\n<html><head><title>hello</title></head><body></body></html>`)
    });
  });

  describe('element', function () {
    it('throws if #id is not: a-z 0-9 _', function () {
      assert.throws(function () {
        BE('p', '#hel"lp', 'spacer');
      }, `Invalid characters in id/class: #hel"lp`)
    });

    it('throws if .class is not: a-z 0-9 _', function () {
      assert.throws(function () {
        BE('p', '.he"p', 'spacer');
      }, `Invalid characters in id/class: .he"p`)
    });

    it('.to_html returns an HTML string', function () {
      const html = BE('span', 'hello');
      assert.equal(html.to_html(), '<span>hello</span>');
    });

    it('.to_html escapes tags', function () {
      const html = BE('span', `<script>hello</script>`);
      assert.equal(html.to_html(), '<span>&lt;script&gt;hello&lt;/script&gt;</span>');
    });

    it('.to_html escapes quotation marks', function () {
      const html = BE('span', `"hello'`);
      assert.equal(html.to_html(), '<span>&quot;hello&#39;</span>');
    });

    it('.to_html renders attributes', function () {
      const html = BE('html', {lang: 'en'});
      assert.equal(html.to_html(), '<html lang="en"></html>');
    });

    it('.to_html does not render closing tags for void elements', function () {
      const html = BE('body', BE('meta'), BE('link'), BE('img'));
      assert.equal(html.to_html(), '<body><meta><link><img></body>');
    });

    // it('.to_html escapes quotes in the class attribute', function () {
    //   const html = BE('a.he"lo', 'hello');
    //   assert.equal(html.to_html(), '<a class="he&quot;lo">hello</a>');
    // });

    it('.to_html escapes quotes in any attribute', function () {
      const html = BE('p', {bob: "hel'lo"});
      assert.equal(html.to_html(), '<p bob="hel&#39;lo"></p>');
    });

  });
