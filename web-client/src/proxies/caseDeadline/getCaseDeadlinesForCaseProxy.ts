import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCaseDeadlinesForCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
) => {
  return get({
    applicationContext,
    endpoint: `/case-deadlines/${docketNumber}`,
  });
};
