import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const runTrialSessionPlanningReportInteractor = (
  applicationContext: ClientApplicationContext,
  { term, year }: { term: string; year: number },
): Promise<{
  fileId: string;
  url: string;
}> => {
  return post({
    applicationContext,
    body: {
      term,
      year,
    },
    endpoint: '/reports/planning-report',
  });
};
