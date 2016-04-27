var Injector = require('../index');
var should = require('should');

describe('basic test 1', function() {
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



describe('basic test 2', function() {
  it('functional di', function(finish) {
    injector = new Injector();

    var count = 0;
    injector.addTask('thing1', [function(done) {
      return done(null, 3);
    }]);

    injector.addTask('thing2', ['thing1', function(t1,done) {
      count++;
      return done(null, t1+2);
    }]);

    injector.addTask('thing3', ['thing1','thing2', function(t1,t2,done) {
      count++;
      return done(null, t1+t2+2);
    }]);
    //
    injector.run(['thing3', function(t1, done) {
        t1.should.be.exactly(10);
        // console.log("Data is " +t3);
        count.should.be.exactly(2);
        done();
    }]);
    injector.run(['thing3', function(t1, done) {
        t1.should.be.exactly(10);
        // console.log("Data is " +t3);
        count.should.be.exactly(2);
        done();
    }]);
    finish();
  });
});


// async test
describe('basic test 2', function() {
  it('functional di', function(finish) {
      var count = 0;
      injector.addTask('thing5', [function(done) {
          setTimeout(function() {
            count++;
            return done(null, count);
          }, 1000);
      }]);

      injector.addTask('thing6', ['thing5', function(t1,done) {
          setTimeout(function() {
            count++;
            return done(null, count);
          }, 1000);
      }]);

      injector.run(['thing6', function(t3, done) {
          t3.should.be.exactly(2);
          console.log("Data is----->> " +t3);
          count.should.be.exactly(2);
          done();
          finish();
      }]);
  });
});



describe('basic test 3 ', function() {
  it('functional di', function(finish) {
    var injector = new Injector();
    injector.addTask('thing7', [function(done) {
          return done(null, 1);
    }]);
    injector.addTask('thing8', [function(done) {
          return done(null, 2);
    }]);
    injector.addTask('thing9', ['thing7','thing8', function(t1,t2,done) {
          return done(null, t1+t2);
    }]);

    injector.addTask('thing10', ['thing7','thing8','thing9', function(t1,t2,t3,done) {
          return done(null, t1+t2+t3);
    }]);
    injector.run(['thing10', function(t3, done) {
        t3.should.be.exactly(6);
        done();
        finish();
    }]);
  });
});
