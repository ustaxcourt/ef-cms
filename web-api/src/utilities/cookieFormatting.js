exports.createCookieString = (
  cookieKey,
  cookieValue,
  expiresDateTime,
  domain,
  secure = true,
  httpOnly = true,
) => {
  let cookieString = `${cookieKey}=${cookieValue}; Expires=${expiresDateTime}; Domain=${domain}`;

  if (secure) {
    cookieString += '; Secure';
  }
  if (httpOnly) {
    cookieString += '; HttpOnly';
  }

  return cookieString;
};

exports.deleteCookieString = (
  cookieKey,
  domain,
  secure = true,
  httpOnly = true,
) => {
  const expiresDate = 'Thu, 01 Jan 1970 00:00:00 GMT';
  let cookieString = `${cookieKey}=deleted; Expires=${expiresDate}; Domain=${domain}`;

  if (secure) {
    cookieString += '; Secure';
  }
  if (httpOnly) {
    cookieString += '; HttpOnly';
  }

  return cookieString;
};
