const client = require('../../dynamodbClientService');

/**
 * Checks to see if the environment currentColor matches that of the deploy table
 *
 * @param {object} applicationContext The applicationContext
 * @returns {Promise} which resolves to whether or not the current color matches what's in the deploy table
 */
exports.isCurrentColorActive = async applicationContext => {
  const [{ value: currentColor }] = await client.query({
    Key: {
      pk: 'current-color',
      sk: 'current-color',
    },
    TableName: client.getDeployTableName({ applicationContext }),
    applicationContext,
  });

  return process.env.CURRENT_COLOR === currentColor;
};
