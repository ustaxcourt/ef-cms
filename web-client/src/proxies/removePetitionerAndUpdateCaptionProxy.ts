import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const removePetitionerAndUpdateCaptionInteractor = (
  applicationContext: ClientApplicationContext,
  { caseCaption, contactId, docketNumber },
): Promise<CaseDTO> => {
  return put({
    applicationContext,
    body: { caseCaption },
    endpoint: `/case-meta/${docketNumber}/remove-petitioner/${contactId}`,
  });
};
