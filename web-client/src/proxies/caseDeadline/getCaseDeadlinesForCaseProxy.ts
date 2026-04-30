import { RawCaseDeadline } from 'shared/src/business/entities/CaseDeadline';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCaseDeadlinesForCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
): Promise<RawCaseDeadline[]> => {
  return get({
    applicationContext,
    endpoint: `/case-deadlines/${docketNumber}`,
  });
};
