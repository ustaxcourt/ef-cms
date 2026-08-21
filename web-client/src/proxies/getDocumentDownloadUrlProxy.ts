import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getDocumentDownloadUrlInteractor = (
  applicationContext: ClientApplicationContext,
  {
    docketNumber,
    isPublic,
    key,
  }: { docketNumber: string; isPublic?: boolean; key: string },
): Promise<{ url: string }> => {
  return get({
    applicationContext,
    endpoint: isPublic
      ? `/public-api/${docketNumber}/${key}/public-document-download-url`
      : `/case-documents/${docketNumber}/${key}/document-download-url`,
  });
};
