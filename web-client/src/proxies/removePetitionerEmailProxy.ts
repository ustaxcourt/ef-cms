import { RawPetitioner } from '@shared/business/entities/contacts/Petitioner';
import { post } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const removePetitionerEmailInteractor = (
  applicationContext: ClientApplicationContext,
  { email, docketNumber },
): Promise<RawPetitioner> => {
  return post({
    applicationContext,
    body: { email, docketNumber },
    endpoint: `/case-parties/${docketNumber}/remove-petitioner-email`,
  });
};
