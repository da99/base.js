
  it('changes htmlFor to for', function () {
    const x = E('label', {htmlFor: 'hello'}, 'Hello');
    assert.equal(x.getAttribute('for'), 'hello')
  })
