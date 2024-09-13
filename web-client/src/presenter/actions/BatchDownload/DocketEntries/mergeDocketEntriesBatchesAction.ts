import { ClientApplicationContext } from '@web-client/applicationContext';
import { state } from '@web-client/presenter/app.cerebral';
import { unzipSync, zipSync } from 'fflate';

const mergeZipFiles = async (
  applicationContext: ClientApplicationContext,
  zipUrls,
) => {
  if (zipUrls.length === 0) return;

  const allFiles = {};
  const zipContents = await Promise.all(
    zipUrls.map(async url => {
      const response = await applicationContext
        .getHttpClient()
        .get(url, { responseType: 'arraybuffer' });

      const arrayBuffer = response.data;
      const contents = await unzipSync(new Uint8Array(arrayBuffer));
      return contents;
    }),
  );

  zipContents.forEach(contents => {
    Object.entries(contents).forEach(([rootPath, content]) => {
      const fileName = rootPath.split('/').slice(1).join('/');
      allFiles[fileName] = content;
    });
  });

  const newZip = zipSync(allFiles);
  return new Blob([newZip], { type: 'application/zip' });
};

export const mergeDocketEntriesBatchesAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps<{
  uuid: string;
  caseFolder: string;
}>) => {
  const { caseFolder, uuid } = props;
  const docketEntriesBatchDownload = get(state.docketEntriesBatchDownload);

  const sortedUrls = docketEntriesBatchDownload[uuid]
    .sort((a, b) => a.index - b.index)
    .map(x => x.url);

  const contentBlob = await mergeZipFiles(applicationContext, sortedUrls);
  if (!contentBlob) throw Error('Unable to merge ZIP files');

  applicationContext.getUtilities().downloadBlob({
    blob: contentBlob,
    fileName: `${caseFolder}.zip`,
  });
};
