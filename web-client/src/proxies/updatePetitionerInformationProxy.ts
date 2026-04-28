import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updatePetitionerInformationInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, updatedPetitionerData },
) => {
  return put({
    applicationContext,
    body: { updatedPetitionerData },
    endpoint: `/case-parties/${docketNumber}/petitioner-info`,
  });
};
