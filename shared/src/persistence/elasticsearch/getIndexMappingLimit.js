/**
 * @param {object} params deconstructed arguments
 * @param {object} params.applicationContext the application context
 * @param {string} params.index the index we're querying
 * @return {string} the limit for the specified index
 */
exports.getIndexMappingLimit = async ({ applicationContext, index }) => {
  const searchClient = applicationContext.getSearchClient();

  const indexSettings = await searchClient.indices.getSettings({
    index,
  });

  return indexSettings.efcms.settings.index.mapping.total_fields.limit;
};
