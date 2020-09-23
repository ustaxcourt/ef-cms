/**
 * adds headers
 *
 * @param {object} event the AWS event object
 * @param {object} context the context
 * @param {object} callback the callback
 */
exports.handler = (event, context, callback) => {
  //Get contents of response
  const { request, response } = event.Records[0].cf;
  const { headers } = response;
  const { headers: requestHeaders } = request;

  let allowedDomain;
  if (
    requestHeaders['x-allowed-domain'] &&
    requestHeaders['x-allowed-domain'][0] &&
    requestHeaders['x-allowed-domain'][0].value
  ) {
    allowedDomain = requestHeaders['x-allowed-domain'][0].value;
  }
  const allowedDomainString = allowedDomain || '';

  //Set new headers
  headers['strict-transport-security'] = [
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubdomains; preload',
    },
  ];
  const applicationUrl = `https://${allowedDomainString}`;
  const subdomainsUrl = `https://*.${allowedDomainString}`;
  const cognitoUrl = 'https://*.auth.us-east-1.amazoncognito.com';
  const dynamsoftUrl = 'https://dynamsoft-lib.stg.ef-cms.ustaxcourt.gov';
  const websocketUrl = `wss://*.${allowedDomainString}`;
  const honeybadgerApiUrl = 'https://api.honeybadger.io';
  const localUrl = 'https://127.0.0.1:*';
  const localWebsocketUrl = 'ws://127.0.0.1:*';
  const s3Url = 'https://s3.us-east-1.amazonaws.com';
  const contentSecurityPolicy = [
    'base-uri resource://pdf.js',
    `connect-src ${subdomainsUrl} ${applicationUrl} ${cognitoUrl} ${s3Url} ${dynamsoftUrl} ${localUrl} ${websocketUrl} ${localWebsocketUrl} ${honeybadgerApiUrl}`,
    "default-src 'none'",
    "manifest-src 'self'",
    `form-action ${applicationUrl} ${subdomainsUrl}`,
    "object-src 'none'",
    `script-src 'self' 'unsafe-inline' ${dynamsoftUrl} resource://pdf.js`,
    `style-src 'self' 'unsafe-inline' ${dynamsoftUrl}`,
    `img-src ${applicationUrl} ${subdomainsUrl} data:`,
    `font-src ${applicationUrl} ${subdomainsUrl}`,
    `frame-src ${s3Url} ${subdomainsUrl} blob:`,
    "frame-ancestors 'none'",
  ];
  headers['content-security-policy'] = [
    {
      key: 'Content-Security-Policy',
      value: contentSecurityPolicy.join('; '),
    },
  ];
  headers['x-content-type-options'] = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
  ];
  headers['x-frame-options'] = [{ key: 'X-Frame-Options', value: 'DENY' }];
  headers['x-xss-protection'] = [
    { key: 'X-XSS-Protection', value: '1; mode=block' },
  ];
  headers['referrer-policy'] = [
    { key: 'Referrer-Policy', value: 'same-origin' },
  ];

  //Return modified response
  callback(null, response);
};
