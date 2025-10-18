
    it('should return an HTML Element: a', function () {
      const x = split_tag_name('a');
      assert.equal(x.tagName, 'A');
    });
    it('should add the class name to the element: a.hello', function () {
      const x = split_tag_name('a.hello');
      assert.equal(x.classList.toString(), 'hello');
    });
    it('should add the id to the element: a#the_link', function () {
      const x = split_tag_name('a#the_link');
      assert.equal(x.id, 'the_link');
    });
    it('should add the classes and id to the element: a#the_link.hello.world', function () {
      const x = split_tag_name('a#the_link.hello.world');
      assert.equal(x.id, 'the_link');
      assert.equal(x.classList.toString(), 'hello world');
    });
