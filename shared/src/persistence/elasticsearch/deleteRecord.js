exports.deleteRecord = async ({ applicationContext, indexName, recordId }) => {
  const searchClient = applicationContext.getSearchClient();

  if (recordId && indexName) {
    await searchClient.delete({
      id: recordId,
      index: indexName,
    });
  }
};
