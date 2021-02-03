const { DynamoDB } = require('aws-sdk');
/**
 * This function makes it easy to lookup the current version so that we can perform searches against it
 *
 * @param {String} environmentName The environment we are going to lookup the current color
 * @returns {String} The current version of the application
 */
exports.getVersion = async environmentName => {
  const dynamodb = new DynamoDB({ region: 'us-east-1' });
  const result = await dynamodb
    .getItem({
      Key: {
        pk: {
          S: 'source-table-version',
        },
        sk: {
          S: 'source-table-version',
        },
      },
      TableName: `efcms-deploy-${environmentName}`,
    })
    .promise();

  if (!result || !result.Item) {
    throw 'Could not determine the current version';
  }
  return result.Item.current.S;
};

/**
 * Simple function to help ensure that a value is truthy before allowing the process to continue
 *
 * @param {String} value The value to ensure is truthy
 * @param {String} message The message to relay if the value is not truthy
 */
exports.checkEnvVar = (value, message) => {
  if (!value) {
    console.log(message);
    process.exit(1);
  }
};
