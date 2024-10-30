import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { Get } from 'cerebral';
import { compact } from 'lodash';
import { state } from '@web-client/presenter/app-public.cerebral';

export const publicTrialSessionDetailHelper = (
  get: Get,
  applicationContext: ClientPublicApplicationContext,
): {
  formattedTrialSession: {
    trialLocation?: string;
    formattedTerm: string;
    formattedEstimatedEndDate: string;
    formattedStartDate: string;
    formattedStartDateFull: string;
    sessionStatus: string;
    formattedCityStateZip: string;
  };
} => {
  const trialSession = get(state.trialSessionDetailsPage.trialSession);

  const twoDigitTermYear = trialSession.termYear.slice(2);
  const formattedTerm = `${trialSession.term} ${twoDigitTermYear}`;

  const formattedStartDate = applicationContext
    .getUtilities()
    .formatDateString(trialSession.startDate, 'MMDDYY');

  const formattedEstimatedEndDate = applicationContext
    .getUtilities()
    .formatDateString(trialSession.estimatedEndDate!, 'MMDDYY');

  const formattedStartDateFull = applicationContext
    .getUtilities()
    .formatDateString(trialSession.startDate, 'MONTH_DAY_YEAR');

  const formattedCityStateZip = compact([
    trialSession.city ? `${trialSession.city},` : undefined,
    trialSession.state,
    trialSession.postalCode,
  ]).join(' ');

  const formattedTrialSession = {
    formattedCityStateZip,
    formattedEstimatedEndDate,
    formattedStartDate,
    formattedStartDateFull,
    formattedTerm,
    sessionStatus: trialSession.sessionStatus,
    // TODO 10461: remove as needed
    trialLocation: trialSession.trialLocation,
  };

  return { formattedTrialSession };
};
