/**
 * adds headers
 *
 * @param {object} awsEvent the AWS event object
 * @param {object} handlerContext the context
 * @param {object} callback the callback
 */
export const handler = (awsEvent, handlerContext, callback) => {
  //Get contents of response
  const { request, response } = awsEvent.Records[0].cf;
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
  const dynamsoftUrlStaging = 'https://dynamsoft-lib.stg.ef-cms.ustaxcourt.gov';
  const dynamsoftUrlTest = 'https://dynamsoft-lib.test.ef-cms.ustaxcourt.gov';
  const dynamsoftUrlProd = 'https://dynamsoft-lib.dawson.ustaxcourt.gov';
  const websocketUrl = `wss://*.${allowedDomainString}`;
  const localUrl = 'https://127.0.0.1:*';
  const localWebsocketUrl = 'ws://127.0.0.1:*';
  const s3Url = 'https://s3.us-east-1.amazonaws.com';
  const statuspageUrl = 'https://lynmjtcq5px1.statuspage.io';
  const pdfjsExpressUrl = 'https://*.pdfjs.express';
  const contentSecurityPolicy = [
    'base-uri resource://pdf.js',
    `connect-src blob: ${subdomainsUrl} ${applicationUrl} ${s3Url} ${dynamsoftUrlProd} ${dynamsoftUrlTest} ${dynamsoftUrlStaging} ${localUrl} ${websocketUrl} ${localWebsocketUrl} ${pdfjsExpressUrl}`,
    "default-src 'none'",
    "manifest-src 'self'",
    `form-action ${applicationUrl} ${subdomainsUrl}`,
    `object-src ${subdomainsUrl} ${applicationUrl} ${s3Url}`,
    `script-src 'self' 'unsafe-inline' ${dynamsoftUrlProd} ${dynamsoftUrlTest} ${dynamsoftUrlStaging} ${statuspageUrl} resource://pdf.js`,
    `worker-src blob: ${subdomainsUrl}`,
    `style-src 'self' 'unsafe-inline' ${dynamsoftUrlProd} ${dynamsoftUrlTest} ${dynamsoftUrlStaging}`,
    `img-src ${applicationUrl} ${subdomainsUrl} blob: data:`,
    `font-src ${applicationUrl} ${subdomainsUrl} data:`,
    `frame-src ${s3Url} ${subdomainsUrl} ${statuspageUrl} blob: data:`,
    "frame-ancestors 'self'",
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
