import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getDocumentContentsForDocketEntryInteractor = (
  applicationContext: ClientApplicationContext,
  { documentContentsId },
): Promise<{ documentContents: string; richText: string }> => {
  return get({
    applicationContext,
    endpoint: `/case-documents/${documentContentsId}/document-contents`,
  });
};
