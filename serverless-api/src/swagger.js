'use strict';

const swagger = require('../swagger.json');

/**
 * Swagger HTML Page Lambda
 *
 * @param event
 * @param context
 * @param callback
 */
exports.handler = (event, context, callback) => {

  const done = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? JSON.stringify(err.message) : res.result,
    headers: {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*'
    },
  });

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

  done(null, { result: body });
};