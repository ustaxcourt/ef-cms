export const deleteRecord = async ({
  applicationContext,
  indexName,
  recordId,
}) => {
  const client = applicationContext.getSearchClient();

  if (recordId && indexName) {
    await client.remove({
      id: recordId,
      index: indexName,
    });
  }
};
