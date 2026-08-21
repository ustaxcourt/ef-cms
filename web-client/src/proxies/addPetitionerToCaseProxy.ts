import { post } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { CaseDTO } from '@shared/business/dto/cases/CaseDTO';

export const addPetitionerToCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { caseCaption, contact, docketNumber },
): Promise<CaseDTO> => {
  return post({
    applicationContext,
    body: { caseCaption, contact },
    endpoint: `/case-meta/${docketNumber}/add-petitioner`,
  });
};
