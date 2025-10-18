allow_tags('html', 'head', 'meta', 'body', 'link', 'img', 'title');

  it('returns an Element', function () {
    const x = E('a', {href: 'https://jaki.club/'}, 'Jaki.ClUb');
    assert.equal(x.tagName, 'A');
  });
  it('returns an Element with a class name', function () {
    const x = E('a', '.hello.world.2', {href: 'https://jaki.club/'}, 'Jaki.ClUb');
    assert.equal(x.classList.toString(), 'hello world 2');
  });
  it('returns an Element with an id', function () {
    const x = E('a', '#main', {href: 'https://jaki.club/'}, 'Jaki.ClUb');
    assert.equal(x.id, 'main');
  });
  it('sets an attributes on the element', function () {
    const href = 'https://jaki.club/';
    const x = E('a', '#main', {href: href}, 'Jaki.ClUb');
    assert.equal(x.href, href);
  });
  it('adds text nodes to the element', function () {
    const x = E('div', 'a', 'b', 'c');
    assert.equal(x.textContent, 'abc');
  });
  it('adds elements as children', function () {
    const x = E('div', E('p', 'hello'), E('p', 'world'));
    assert.equal(x.innerHTML, '<p>hello</p><p>world</p>');
  });
