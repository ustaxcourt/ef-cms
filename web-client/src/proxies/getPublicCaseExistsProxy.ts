import { head } from './requests';

export const getPublicCaseExistsInteractor = (
  applicationContext,
  { docketNumber },
) => {
  return head({
    applicationContext,
    endpoint: `/public-api/cases/${docketNumber}`,
    params: undefined,
  });
};
