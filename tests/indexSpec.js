var Anachronic = require('../index');
var should = require('should');

describe('basic test 1', function() {
  it('functional di', function(finish) {
    var anachronic = new Anachronic();
    var count = 0;
    anachronic.addTask('thing1', [function(done) {
      count++;
      return done(null, 3);
    }]);

    anachronic.run(['thing1', function(t1, done) {
      t1.should.be.exactly(3);
      count.should.be.exactly(1);

      anachronic.run(['thing1', function(t2, done) {
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
    anachronic = new Anachronic();

    var count = 0;
    anachronic.addTask('thing1', [function(done) {
      return done(null, 3);
    }]);

    anachronic.addTask('thing2', ['thing1', function(t1,done) {
      count++;
      return done(null, t1+2);
    }]);

    anachronic.addTask('thing3', ['thing1','thing2', function(t1,t2,done) {
      count++;
      return done(null, t1+t2+2);
    }]);
    //
    anachronic.run(['thing3', function(t1, done) {
        t1.should.be.exactly(10);
        // console.log("Data is " +t3);
        count.should.be.exactly(2);
        done();
    }]);
    anachronic.run(['thing3', function(t1, done) {
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
      anachronic.addTask('thing5', [function(done) {
          setTimeout(function() {
            count++;
            return done(null, count);
          }, 1000);
      }]);

      anachronic.addTask('thing6', ['thing5', function(t1,done) {
          setTimeout(function() {
            count++;
            return done(null, count);
          }, 1000);
      }]);

      anachronic.run(['thing6', function(t3, done) {
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
    var anachronic = new Anachronic();
    anachronic.addTask('thing7', [function(done) {
          return done(null, 1);
    }]);
    anachronic.addTask('thing8', [function(done) {
          return done(null, 2);
    }]);
    anachronic.addTask('thing9', ['thing7','thing8', function(t1,t2,done) {
          return done(null, t1+t2);
    }]);

    anachronic.addTask('thing10', ['thing7','thing8','thing9', function(t1,t2,t3,done) {
          return done(null, t1+t2+t3);
    }]);
    anachronic.run(['thing10', function(t3, done) {
        t3.should.be.exactly(6);
        done();
        finish();
    }]);
  });
});
