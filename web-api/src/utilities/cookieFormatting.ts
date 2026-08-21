import { parseCookie, stringifySetCookie } from 'cookie';
import { DateTime } from 'luxon';

export const createCookieString = (
  cookieKey: string,
  cookieValue: string,
  expiresDateTime: string,
  domain?: string,
  secure = true,
  httpOnly = true,
) => {
  return stringifySetCookie({
    domain,
    expires: DateTime.fromISO(expiresDateTime).toJSDate(),
    httpOnly,
    name: cookieKey,
    secure,
    value: cookieValue,
  });
};

export const deleteCookieString = (
  cookieKey: string,
  domain?: string,
  secure = true,
  httpOnly = true,
) => {
  return stringifySetCookie({
    domain,
    expires: DateTime.fromMillis(1).toJSDate(),
    httpOnly,
    name: cookieKey,
    secure,
    value: 'deleted',
  });
};

export const parseCookieString = (
  cookieString: string,
): Record<string, string> => {
  return parseCookie(cookieString) as Record<string, string>;
};
