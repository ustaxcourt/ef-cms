import { post } from './requests';

export const removePetitionerEmailInteractor = (
  applicationContext,
  { email, docketNumber },
) => {
  return post({
    applicationContext,
    body: { email, docketNumber },
    endpoint: `/case-parties/${docketNumber}/remove-petitioner-email`,
  });
};
