import {
  Case,
  isInConsolidatedGroup,
  isLeadCase,
} from '@shared/business/entities/cases/Case';
import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { Get } from 'cerebral';
import { compact, some } from 'lodash';
import { state } from '@web-client/presenter/app-public.cerebral';

// 10461 TODO: can we extend getFormattedCaseDetail
const formatPublicCase = (publicCase: any) => {
  /*
    consolidatedIconToolTipText X
    inConsolidatedGroup X
    isLeadCase X
    shouldIndent?!!
    docketNumber X
    respondent.name
    privatePractitioners .name
    irsPractitioners .name
    caseTitle X
  */
  publicCase.isLeadCase = isLeadCase(publicCase);
  publicCase.inConsolidatedGroup = isInConsolidatedGroup(publicCase);

  // 10461 TODO: copied almost verbatim from getFormattedCaseDetail, should be extracted into something more reusable
  let consolidatedIconTooltipText;

  if (publicCase.inConsolidatedGroup) {
    if (publicCase.isLeadCase) {
      consolidatedIconTooltipText = 'Lead case';
    } else {
      consolidatedIconTooltipText = 'Consolidated case';
    }
  }

  publicCase.consolidatedIconTooltipText = consolidatedIconTooltipText;
  publicCase.caseTitle = Case.getCaseTitle(publicCase.caseCaption);
  return publicCase;
};

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
    hasCourthouseInformation: boolean;
    formattedCases: any[];
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

  const hasCourthouseInformation = some([
    trialSession.courthouseName,
    trialSession.address1,
    trialSession.address2,
    formattedCityStateZip,
  ]);

  // 10461 TODO: Are they already sorted?
  const formattedCases = Case.sortByDocketNumber(
    trialSession.openCases.map(c => formatPublicCase(c)),
  );

  console.log('formattedCases', formattedCases);

  const formattedTrialSession = {
    formattedCases,
    formattedCityStateZip,
    formattedEstimatedEndDate,
    formattedStartDate,
    formattedStartDateFull,
    formattedTerm,
    hasCourthouseInformation,

    sessionStatus: trialSession.sessionStatus,
    // TODO 10461: remove as needed
    trialLocation: trialSession.trialLocation,
  };

  return { formattedTrialSession };
};
