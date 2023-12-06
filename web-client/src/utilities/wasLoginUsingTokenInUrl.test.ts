import { wasLoginUsingTokenInUrl } from './wasLoginUsingTokenInUrl';

describe('wasLoginUsingTokenInUrl', () => {
  it('should return true if the url contains ?code', () => {
    expect(
      wasLoginUsingTokenInUrl('http://localhost/log-in?token=12345'),
    ).toBeTruthy();
  });

  it('should return false if the url does not contain ?token', () => {
    expect(wasLoginUsingTokenInUrl('http://localhost/log-in')).toBeFalsy();
  });
});
