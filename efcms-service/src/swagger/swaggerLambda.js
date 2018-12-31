const swagger = require('../../swagger.json');
/**
 * Renders a simple HTML page that loads up the swagger-ui package and consumes the swagger.json file found at the root of this project.
 *
 * @param {Error} err
 * @returns {Object} the api-gateway response object where body contains the HTML
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
            spec: ${JSON.stringify(swagger)}
          });
        </script>
      </body>
    </html>`;

  return {
    statusCode: '200',
    body: body,
    headers: {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*'
    },
  }
};
