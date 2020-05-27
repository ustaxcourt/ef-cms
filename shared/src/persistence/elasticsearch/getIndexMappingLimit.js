exports.getIndexMappingLimit = async ({ applicationContext, index }) => {
  const searchClient = applicationContext.getSearchClient();

  const indexSettings = await searchClient.indices.getSettings({
    index,
  });

  return indexSettings.efcms.settings.index.mapping.total_fields.limit;
};
