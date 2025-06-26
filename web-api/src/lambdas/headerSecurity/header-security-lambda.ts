import { CloudFrontResponse, CloudFrontResponseEvent } from 'aws-lambda';

// AWS lambda handlers must be async to work properly
export const handler = async (
  awsEvent: CloudFrontResponseEvent,
  // eslint-disable-next-line @typescript-eslint/require-await
): Promise<CloudFrontResponse> => {
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
  const unpkgUrl = 'https://unpkg.com'; // used to download dynamsoft for scanning
  const websocketUrl = `wss://*.${allowedDomainString}`;
  const localUrl = 'https://127.0.0.1:*';
  const localWebsocketUrl = 'ws://127.0.0.1:*';
  const s3Url = 'https://s3.us-east-1.amazonaws.com';
  const statuspageUrl = 'https://lynmjtcq5px1.statuspage.io';
  const pdfjsExpressUrl = 'https://*.pdfjs.express';
  const cognitoIdentityUrl = 'https://cognito-identity.us-east-1.amazonaws.com';
  const rumEndpointUrl = 'https://dataplane.rum.us-east-1.amazonaws.com';
  const contentSecurityPolicy = [
    'base-uri resource://pdf.js',
    `connect-src blob: ${subdomainsUrl} ${applicationUrl} ${s3Url} ${unpkgUrl} ${localUrl} ${websocketUrl} ${localWebsocketUrl} ${pdfjsExpressUrl} ${cognitoIdentityUrl} ${rumEndpointUrl}`,
    "default-src 'none'",
    "manifest-src 'self'",
    `form-action ${applicationUrl} ${subdomainsUrl}`,
    `object-src ${subdomainsUrl} ${applicationUrl} ${s3Url}`,
    `script-src 'self' 'unsafe-inline' ${unpkgUrl} ${statuspageUrl} resource://pdf.js`,
    `worker-src blob: ${subdomainsUrl}`,
    `style-src 'self' 'unsafe-inline'`,
    `style-src-elem 'self' 'unsafe-inline' ${applicationUrl} ${subdomainsUrl} ${unpkgUrl}`,
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

  return response;
};
