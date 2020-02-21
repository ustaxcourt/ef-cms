/**
 * adds headers
 *
 * @param {object} event the AWS event object
 * @param {object} context the context
 * @param {object} callback the callback
 */
exports.handler = (event, context, callback) => {
  //Get contents of response
  const { response } = event.Records[0].cf;
  const { headers } = response;

  const allowedDomain = `*${headers['x-allowed-domain']}`;

  //Set new headers
  headers['strict-transport-security'] = [
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubdomains; preload',
    },
  ];
  headers['content-security-policy'] = [
    {
      key: 'Content-Security-Policy',
      value: `default-src '${allowedDomain}'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'`,
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
