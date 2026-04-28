import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const removePetitionerAndUpdateCaptionInteractor = (
  applicationContext: ClientApplicationContext,
  { caseCaption, contactId, docketNumber },
) => {
  return put({
    applicationContext,
    body: { caseCaption },
    endpoint: `/case-meta/${docketNumber}/remove-petitioner/${contactId}`,
  });
};
