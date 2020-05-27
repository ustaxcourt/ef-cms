exports.getIndexMappingFields = async ({ applicationContext, index }) => {
  const searchClient = applicationContext.getSearchClient();

  const indexMapping = await searchClient.indices.getMapping({
    index,
  });

  return indexMapping.efcms.mappings.properties;
};
