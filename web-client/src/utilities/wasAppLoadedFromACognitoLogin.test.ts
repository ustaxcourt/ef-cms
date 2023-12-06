import { wasAppLoadedFromACognitoLogin } from './wasAppLoadedFromACognitoLogin';

describe('wasAppLoadedFromACognitoLogin', () => {
  it('should return true if the url contains ?code', () => {
    expect(
      wasAppLoadedFromACognitoLogin('http://localhost/log-in?code=abc'),
    ).toBeTruthy();
  });

  it('should return false if the url does not contain ?code', () => {
    expect(
      wasAppLoadedFromACognitoLogin('http://localhost/log-in'),
    ).toBeFalsy();
  });
});
