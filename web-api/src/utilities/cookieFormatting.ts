import { parse, serialize } from 'cookie';
import { DateTime } from 'luxon';

export const createCookieString = (
  cookieKey: string,
  cookieValue: string,
  expiresDateTime: string,
  domain?: string,
  secure = true,
  httpOnly = true,
) => {
  return serialize(cookieKey, cookieValue, {
    domain,
    expires: DateTime.fromISO(expiresDateTime).toJSDate(),
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
  return serialize(cookieKey, 'deleted', {
    domain,
    expires: DateTime.fromMillis(1).toJSDate(),
    httpOnly,
    secure,
  });
};

export const parseCookieString = (
  cookieString: string,
): Record<string, string> => {
  return parse(cookieString) as Record<string, string>;
};
