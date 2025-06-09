import { RawPetitioner } from '@shared/business/entities/contacts/Petitioner';
import { post } from './requests';

export const removePetitionerEmailInteractor = (
  applicationContext,
  { email, docketNumber },
): Promise<RawPetitioner> => {
  return post({
    applicationContext,
    body: { email, docketNumber },
    endpoint: `/case-parties/${docketNumber}/remove-petitioner-email`,
  });
};
