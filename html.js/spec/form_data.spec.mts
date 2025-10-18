
  it('returns an object', function () {
    const data = form_data(E('form', E('input', {name: 'msg', type: 'hidden', value: 'hello'})));
    assert.deepEqual(data, {msg: 'hello'});
  });
  it('returns an object with arrays for multiple values', function () {
    const data = form_data(
      E('form',
        E('input', {name: 'msg', type: 'hidden', value: 'hello1'}),
        E('input', {name: 'msg', type: 'hidden', value: 'hello2'})
      )
    );
    assert.deepEqual(data, {msg: ['hello1', 'hello2']});
  });
