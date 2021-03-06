var assert = require('assert');
var validator = require('../index')

var email = validator.email;
var presence = validator.presence;
var validate = validator.validate;

describe('Validation', function() {
  var params;

  before(function() {
    params = {}
  });

  it('runs validations on the request params', function() {
    params = {
      login: 'nettofarah',
      password: 'secret',
      email: 'nettofarah@gmail.com'
    };

    var validation = validate(params, [
      presence('login'),
      presence('password'),
      email('email')
    ]);

    assert(validation.valid);
    assert(validation.errors.length == 0);
  });

  describe('failed validations', function() {
    var validation;

    before(function() {
      params = {
        login: 'nettofarah',
        email: 'nettofarahatgmail.com'
      };

      validation = validate(params, [
        presence('login'),
        presence('password'),
        email('email')
      ]);
    });

    it('only passes if all validations pass', function() {
      assert(validation.valid == false);
    });

    it('returns all failed validations', function() {
      assert(validation.errors.length == 2);
      assert(validation.errors[0].field == 'password');
      assert(validation.errors[1].field == 'email');
    });

    it('returns all the error messages', function() {
      assert.deepEqual(validation.messages, [
        '"password" required',
        '"email" should look like an email address'
      ]);
    });
  });
});


// No need to overtest here
// We can trust validator.js
describe('Validation Helpers', function() {
  var v = validator;

  function t(validation) {
    assert(validation.result);
  }

  function f(validation) {
    assert(!validation.result);
  }

  it('emails', function () {
    t(v.isEmail('i')({ i: 'nettofarah@gmail.com' }));
    f(v.isEmail('i')({ i: 'nettofarahatgmail.com' }));
  });

  it('contains', function() {
    t(v.contains('i', 'netto')({ i: 'nettofarah' }));
    f(v.contains('i', 'netto')({ i: 'martaleal' }));
  });

  it('isAlpha', function() {
    t(v.isAlpha('i')({ i: 'nettofarah' }));
    f(v.isAlpha('i')({ i: '123123' }));
  });

  it('equals', function() {
    t(v.equals('i', 'nettofarah')({ i: 'nettofarah' }));
    f(v.equals('i', 'nettofarah')({ i: 'buhh' }));

    t(v.isEqual('i', 'nettofarah')({ i: 'nettofarah' }));
    f(v.isEqual('i', 'nettofarah')({ i: 'buhh' }));
  });

  it('isAlphaNumeric', function() {
    t(v.isAlphanumeric('i')({ i: 'nettofarah123' }));
    f(v.isAlphanumeric('i')({ i: '#@' }));
  });

  it('isCreditCard', function() {
    t(v.isCreditCard('i')({ i: '375556917985515' }));
    f(v.isCreditCard('i')({ i: '123123' }));
  });

  it('isCurrency', function() {
    t(v.isCurrency('i')({ i: '$10,123.45' }));
    f(v.isCurrency('i')({ i: 'bla' }));
  });
});
