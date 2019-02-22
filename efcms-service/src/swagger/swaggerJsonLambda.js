const swagger = require('../../swagger.json');
const { headers } = require('../middleware/apiGatewayHelper');

exports.handler = async () => {
  return {
    statusCode: '200',
    body: JSON.stringify(swagger),
    headers,
  };
};
