import cookie from 'cookie';

export const createCookieString = (
  cookieKey: string,
  cookieValue: string,
  expiresDateTime: string,
  domain?: string,
  secure = true,
  httpOnly = true,
) => {
  return cookie.serialize(cookieKey, cookieValue, {
    domain,
    // eslint-disable-next-line @miovision/disallow-date/no-new-date
    expires: new Date(expiresDateTime),
    httpOnly,
    secure,
  });
};

export const deleteCookieString = (
  cookieKey: string,
  domain?: string,
  secure = true,
  httpOnly = true,
) => {
  return cookie.serialize(cookieKey, 'deleted', {
    domain,
    // eslint-disable-next-line @miovision/disallow-date/no-new-date
    expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT'),
    httpOnly,
    secure,
  });
};

export const parseCookieString = (cookieString: string) => {
  return cookie.parse(cookieString);
};
