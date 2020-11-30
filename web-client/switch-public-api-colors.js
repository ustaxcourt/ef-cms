const AWS = require('aws-sdk');

const check = (value, message) => {
  if (!value) {
    console.log(message);
    process.exit(1);
  }
};

const { DEPLOYING_COLOR, EFCMS_DOMAIN, ENV } = process.env;

check(DEPLOYING_COLOR, 'You must have DEPLOYING_COLOR set in your environment');
check(EFCMS_DOMAIN, 'You must have EFCMS_DOMAIN set in your environment');
check(ENV, 'You must have ENV set in your environment');

const REGIONS = ['us-east-1', 'us-west-1'];

const run = async () => {
  for (const region of REGIONS) {
    const apigateway = new AWS.APIGateway({
      region,
    });

    const { items } = await apigateway.getRestApis({ limit: 500 }).promise();

    const apiGatewayRecord = items.find(
      record => record.name === `gateway_api_public_${ENV}_${DEPLOYING_COLOR}`,
    );

    console.log('apiGatewayRecord', apiGatewayRecord);

    apigateway.deleteBasePathMapping(
      {
        basePath: '(none)',
        domainName: `public-api.${EFCMS_DOMAIN}`,
      },
      () => {
        console.log('Successfully deleted base path mapping'); // successful response
        apigateway.createBasePathMapping(
          {
            domainName: `public-api.${EFCMS_DOMAIN}`,
            restApiId: apiGatewayRecord.id,
            stage: ENV,
          },
          (err, data) => {
            if (err) console.log(err, err.stack);
            // an error occurred
            else console.log(data); // successful response
          },
        );
      },
    );
  }
};

run();
