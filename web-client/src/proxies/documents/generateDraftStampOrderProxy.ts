import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const generateDraftStampOrderInteractor = (
  applicationContext: ClientApplicationContext,
  {
    docketNumber,
    formattedDraftDocumentTitle,
    motionDocketEntryId,
    parentMessageId,
    stampData,
  },
) => {
  return post({
    applicationContext,
    body: {
      formattedDraftDocumentTitle,
      motionDocketEntryId,
      parentMessageId,
      stampData,
    },
    endpoint: `/case-documents/${docketNumber}/${motionDocketEntryId}/stamp`,
  });
};
