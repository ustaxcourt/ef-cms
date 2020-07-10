const { get } = require('lodash');
/**
 * @param {object} params deconstructed arguments
 * @param {object} params.applicationContext the application context
 * @param {string} params.index the index we're querying
 * @returns {Promise<string>} the limit for the specified index
 */
exports.getIndexMappingLimit = async ({ applicationContext, index }) => {
  const searchClient = applicationContext.getSearchClient();

  const indexSettings = await searchClient.indices.getSettings({
    index,
  });
  const mappingLimit = get(
    indexSettings,
    `${index}.settings.index.mapping.total_fields.limit`,
  );
  if (!mappingLimit) {
    throw new Error(`Search client index "${index}" settings not found`);
  }
  return mappingLimit;
};
