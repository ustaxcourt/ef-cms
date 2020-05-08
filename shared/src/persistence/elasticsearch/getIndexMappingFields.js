/**
 * @param {object} args deconstructed arguments
 * @param {object} args.applicationContext the application context
 * @param {string} args.index the index we're querying
 * @return {object} the mapping properties of the specified index
 */
exports.getIndexMappingFields = async ({ applicationContext, index }) => {
  const searchClient = applicationContext.getSearchClient();

  const indexMapping = await searchClient.indices.getMapping({
    index,
  });

  return indexMapping.efcms.mappings.properties;
};
