import { post } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const addPetitionerToCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { caseCaption, contact, docketNumber },
) => {
  return post({
    applicationContext,
    body: { caseCaption, contact },
    endpoint: `/case-meta/${docketNumber}/add-petitioner`,
  });
};
