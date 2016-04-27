var Injector = require('../index');
var should = require('should');

describe('basic', function() {
  it('functional di', function(finish) {
    var injector = new Injector();
    var count = 0;
    injector.addTask('thing1', [function(done) {
      count++;
      return done(null, 3);
    }]);

    injector.run(['thing1', function(t1, done) {
      t1.should.be.exactly(3);
      count.should.be.exactly(1);

      injector.run(['thing1', function(t2, done) {
        t2.should.be.exactly(3);
        count.should.be.exactly(1);
        done();
        finish();
      }]);
    }]);
  });
});
