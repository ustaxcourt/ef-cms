export const downloadCsvFileAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { fileName, url } = props.csvInfo;

  const httpClient = applicationContext.getHttpClient();
  const csvString = await getFileContent(httpClient, url);

  return { csvString, fileName };
};

async function getFileContent(httpClient, url) {
  const response = await httpClient
    .get(url, {
      responseType: 'text',
    })
    .catch(() => null);

  return response ? response.data : '';
}
