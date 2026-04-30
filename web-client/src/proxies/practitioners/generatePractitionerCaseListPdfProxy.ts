import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const generatePractitionerCaseListPdfInteractor = (
  applicationContext: ClientApplicationContext,
  { userId },
): Promise<{ fileId: string; url: string }> => {
  return get({
    applicationContext,
    endpoint: `/practitioners/${userId}/printable-case-list`,
  });
};
