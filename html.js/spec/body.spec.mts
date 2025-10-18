
  it('returns the body', function () {
    const b = body(E('p', 'hello world 1'));
    assert.equal(b, document.body);
  });

  it('appends the elements to the body', function () {
    const p = E('p', '#h2', 'hello world 2');
    body(p);
    assert.equal(p, document.body.children[document.body.children.length - 1]);
  });
