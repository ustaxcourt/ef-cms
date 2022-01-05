import { isOnMockLogin } from './isOnMockLogin';

describe('isOnMockLogin', () => {
  it('should return true if the url contains mock-login', () => {
    expect(
      isOnMockLogin('http://localhost/mock-login?token=12345'),
    ).toBeTruthy();
  });

  it('should return false if the url does not contain mock-login', () => {
    expect(isOnMockLogin('http://localhost/mock-logi')).toBeFalsy();
  });
});
