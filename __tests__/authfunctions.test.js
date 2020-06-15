const { loginInformation } = require('../lib/middleware/authFunctions');

describe('authFunctions middleware', () => {

  it('can read a username/password from the header', () => {
    const authorization = 'Basic cnlhbjpwYXNzd29yZA==';
    expect(loginInformation(authorization)).toEqual({
      username: 'ryan',
      password: 'password'
    });
  });
});
