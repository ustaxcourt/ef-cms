const { headers } = require('../middleware/apiGatewayHelper');

/**
 * render the swagger html page
 *
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = async () => {
  const body = `<html>
    <body>
      <head>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.17.4/swagger-ui.css">
      </head>
      <div id="swagger"></div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.17.4/swagger-ui-bundle.js"></script>
      <script>
        SwaggerUIBundle({
          dom_id: '#swagger',
          url: '/v1/swagger.json'
        });
      </script>
    </body>
  </html>`;

  return {
    body: body,
    headers: {
      ...headers,
      'Content-Type': 'text/html',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
    statusCode: '200',
  };
};
