import { PractitionerCaseDetail } from '@web-client/presenter/state';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPractitionerCasesInteractor = (
  applicationContext: ClientApplicationContext,
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
