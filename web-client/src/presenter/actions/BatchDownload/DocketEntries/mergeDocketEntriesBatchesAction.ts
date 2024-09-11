import { ClientApplicationContext } from '@web-client/applicationContext';
import { state } from '@web-client/presenter/app.cerebral';
import { unzipSync, zipSync } from 'fflate';

const mergeZipFiles = async (
  applicationContext: ClientApplicationContext,
  zipUrls,
) => {
  if (zipUrls.length === 0) return;

  const allFiles = {};

  for (let i = 0; i < zipUrls.length; i++) {
    const url = zipUrls[i];
    const response = await applicationContext
      .getHttpClient()
      .get(url, { responseType: 'arraybuffer' });

    const arrayBuffer = response.data;
    const contents = await unzipSync(new Uint8Array(arrayBuffer));

    Object.entries(contents).forEach(([filePath, content]) => {
      const dir = filePath.split('/');
      const fileName = `${dir[dir.length - 1]}`;
      allFiles[fileName] = content;
    });
  }

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
  const docketEtriesBatchDownload = get(state.docketEtriesBatchDownload);

  const sortedUrls = docketEtriesBatchDownload[uuid]
    .sort((a, b) => a.index - b.index)
    .map(x => x.url);

  const contentBlob = await mergeZipFiles(applicationContext, sortedUrls);
  if (!contentBlob) throw Error('Unable to merge ZIP files');

  applicationContext.getUtilities().downloadBlob({
    blob: contentBlob,
    fileName: `${caseFolder}.zip`,
  });
};
