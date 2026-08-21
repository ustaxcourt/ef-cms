import { ClientApplicationContext } from '@web-client/applicationContext';
import {
  PreviousTerm,
  TrialLocationData,
} from '@shared/business/utilities/trialSessionPlanningReport/trialSessionPlanningReportDataTypes';
import { get } from '../requests';

export const getTrialSessionPlanningReportDataInteractor = (
  applicationContext: ClientApplicationContext,
  queryParams: { term: string; year: string },
): Promise<{
  previousTerms: PreviousTerm[];
  trialLocationData: TrialLocationData[];
}> => {
  return get({
    applicationContext,
    endpoint: '/reports/planning-report',
    params: queryParams,
  });
};
