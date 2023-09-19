import { headerOverride } from '../../lambdaWrapper';

/**
 * render the swagger html page
 *
 * @returns {object} the api gateway response object containing the statusCode, body, and headers
 */
export const swaggerLambda = () => {
  const body = `<html>
    <body>
      <head>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.24.2/swagger-ui.css">
      </head>
      <div id="swagger"></div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.24.2/swagger-ui-bundle.js"></script>
      <script>
        SwaggerUIBundle({
          dom_id: '#swagger',
          url: '/api/swagger.json',
          supportedSubmitMethods: []
        });
      </script>
    </body>
  </html>`;

  return {
    body,
    headers: {
      ...headerOverride,
      'Content-Type': 'text/html',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
    statusCode: '200',
  };
};
