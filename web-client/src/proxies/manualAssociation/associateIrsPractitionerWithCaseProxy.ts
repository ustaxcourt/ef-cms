import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const associateIrsPractitionerWithCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, serviceIndicator, userId },
): Promise<RawCase> => {
  return post({
    applicationContext,
    body: { docketNumber, serviceIndicator, userId },
    endpoint: `/case-parties/${docketNumber}/associate-irs-practitioner`,
  });
};
