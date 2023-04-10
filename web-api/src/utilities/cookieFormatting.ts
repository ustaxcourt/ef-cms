const cookie = require('cookie');

exports.createCookieString = (
  cookieKey,
  cookieValue,
  expiresDateTime,
  domain,
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

exports.deleteCookieString = (
  cookieKey,
  domain,
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

exports.parseCookieString = cookieString => {
  return cookie.parse(cookieString);
};
