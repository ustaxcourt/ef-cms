import {
  createCookieString,
  deleteCookieString,
  parseCookieString,
} from './cookieFormatting';

describe('createCookieString', () => {
  const cookieKey = 'DogCow';
  const cookieValue = 'Moof';
  const expiresDateTime = 'Sat, 26 Feb 2022 07:45:00 GMT';
  const domain = 'dawson.ustaxcourt.gov';

  it('correctly formats the cookie string with default arguments', () => {
    const actualCookieString = createCookieString(
      cookieKey,
      cookieValue,
      expiresDateTime,
      domain,
    );

    expect(actualCookieString).toContain(`${cookieKey}=${cookieValue}`);
    expect(actualCookieString).toContain(`Expires=${expiresDateTime}`);
    expect(actualCookieString).toContain(`Domain=${domain}`);
    expect(actualCookieString).toContain('Secure');
    expect(actualCookieString).toContain('HttpOnly');
  });

  it('correctly formats the cookie string with secure being false', () => {
    const actualCookieString = createCookieString(
      cookieKey,
      cookieValue,
      expiresDateTime,
      domain,
      false,
    );

    expect(actualCookieString).toContain(`${cookieKey}=${cookieValue}`);
    expect(actualCookieString).toContain(`Expires=${expiresDateTime}`);
    expect(actualCookieString).toContain(`Domain=${domain}`);
    expect(actualCookieString).not.toContain('Secure');
    expect(actualCookieString).toContain('HttpOnly');
  });

  it('correctly formats the cookie string with httpOnly being false', () => {
    const actualCookieString = createCookieString(
      cookieKey,
      cookieValue,
      expiresDateTime,
      domain,
      true,
      false,
    );

    expect(actualCookieString).toContain(`${cookieKey}=${cookieValue}`);
    expect(actualCookieString).toContain(`Expires=${expiresDateTime}`);
    expect(actualCookieString).toContain(`Domain=${domain}`);
    expect(actualCookieString).toContain('Secure');
    expect(actualCookieString).not.toContain('HttpOnly');
  });

  it('correctly formats the cookie string with secure and httpOnly being false', () => {
    const actualCookieString = createCookieString(
      cookieKey,
      cookieValue,
      expiresDateTime,
      domain,
      false,
      false,
    );

    expect(actualCookieString).toContain(`${cookieKey}=${cookieValue}`);
    expect(actualCookieString).toContain(`Expires=${expiresDateTime}`);
    expect(actualCookieString).toContain(`Domain=${domain}`);
    expect(actualCookieString).not.toContain('Secure');
    expect(actualCookieString).not.toContain('HttpOnly');
  });
});

describe('deleteCookieString', () => {
  const cookieKey = 'DogCow';
  const domain = 'dawson.ustaxcourt.gov';

  it('correctly formats the cookie string with default arguments', () => {
    const actualCookieString = deleteCookieString(cookieKey, domain);

    expect(actualCookieString).toContain(`${cookieKey}=`);
    expect(actualCookieString).toContain(
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    );
    expect(actualCookieString).toContain(`Domain=${domain}`);
    expect(actualCookieString).toContain('Secure');
    expect(actualCookieString).toContain('HttpOnly');
  });

  it('correctly formats the cookie string with secure being false', () => {
    const actualCookieString = deleteCookieString(cookieKey, domain, false);

    expect(actualCookieString).toContain(`${cookieKey}=`);
    expect(actualCookieString).toContain(
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    );
    expect(actualCookieString).toContain(`Domain=${domain}`);
    expect(actualCookieString).not.toContain('Secure');
    expect(actualCookieString).toContain('HttpOnly');
  });

  it('correctly formats the cookie string with httpOnly being false', () => {
    const actualCookieString = deleteCookieString(
      cookieKey,
      domain,
      true,
      false,
    );

    expect(actualCookieString).toContain(`${cookieKey}=`);
    expect(actualCookieString).toContain(
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    );
    expect(actualCookieString).toContain(`Domain=${domain}`);
    expect(actualCookieString).toContain('Secure');
    expect(actualCookieString).not.toContain('HttpOnly');
  });

  it('correctly formats the cookie string with secure and httpOnly being false', () => {
    const actualCookieString = deleteCookieString(
      cookieKey,
      domain,
      false,
      false,
    );

    expect(actualCookieString).toContain(`${cookieKey}=`);
    expect(actualCookieString).toContain(
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    );
    expect(actualCookieString).toContain(`Domain=${domain}`);
    expect(actualCookieString).not.toContain('Secure');
    expect(actualCookieString).not.toContain('HttpOnly');
  });
});

describe('parseCookieString', () => {
  it('should parse a provided cookie string', () => {
    const cookie = parseCookieString('refreshToken=abc');
    expect(cookie).toEqual({
      refreshToken: 'abc',
    });
  });
});
