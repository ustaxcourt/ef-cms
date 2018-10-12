'use strict';

const fs = require('fs');
const path = require('path');


exports.handler = (event, context, callback) => {

  const done = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? JSON.stringify(err.message) : JSON.stringify(res.result),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const swagger = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'swagger.json'), 'utf-8'),
  );

  const body = `
    <html>
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
    </htm>
  `;

  done(null, { result: body });
};

