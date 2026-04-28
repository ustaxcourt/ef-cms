import { PractitionerCaseDetail } from '@web-client/presenter/state';
import { get } from '../requests';

export const getPractitionerCasesInteractor = (
  applicationContext,
  { userId },
): Promise<{
  openCases: PractitionerCaseDetail[];
  closedCases: PractitionerCaseDetail[];
}> => {
  return get({
    applicationContext,
    endpoint: `/practitioners/${userId}/case-list`,
  });
};
