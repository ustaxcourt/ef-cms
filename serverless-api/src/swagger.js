const fs = require('fs');
const path = require('path');
const swagger = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'swagger.json'), 'utf-8'),
);

module.exports.handler = async () => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'text/html',
  },
  body: `
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
  `
});