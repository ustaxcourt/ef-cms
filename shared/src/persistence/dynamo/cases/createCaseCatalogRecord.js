const { put } = require('../../dynamodbClientService');

/**
 * createCaseCatalogRecord
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to create the catalog record
 */
exports.createCaseCatalogRecord = async ({
  applicationContext,
  docketNumber,
}) => {
  await put({
    Item: {
      docketNumber,
      pk: 'catalog',
      sk: `case|${docketNumber}`,
    },
    applicationContext,
  });
};
