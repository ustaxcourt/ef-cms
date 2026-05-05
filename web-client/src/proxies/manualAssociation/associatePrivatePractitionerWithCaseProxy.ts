import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const associatePrivatePractitionerWithCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, representing, serviceIndicator, userId },
): Promise<RawCase> => {
  return post({
    applicationContext,
    body: {
      docketNumber,
      representing,
      serviceIndicator,
      userId,
    },
    endpoint: `/case-parties/${docketNumber}/associate-private-practitioner`,
  });
};
