/* eslint-disable custom-rules-plugin/no-new-dates */
import { parse, serialize } from 'cookie';

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
  return serialize(cookieKey, 'deleted', {
    domain,
    expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT'),
    httpOnly,
    secure,
  });
};

export const parseCookieString = (
  cookieString: string,
): Record<string, string> => {
  return parse(cookieString) as Record<string, string>;
};
