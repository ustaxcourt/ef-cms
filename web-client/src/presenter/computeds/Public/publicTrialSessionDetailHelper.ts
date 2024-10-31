import {
  Case,
  isInConsolidatedGroup,
  isLeadCase,
} from '@shared/business/entities/cases/Case';
import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { Get } from 'cerebral';
import { compact, some } from 'lodash';
import { state } from '@web-client/presenter/app-public.cerebral';

export type TrialSessionPublicCaseRow = {
  isSealed: boolean; // TODO
  privatePractitioners: { name?: string }[];
  irsPractitioners: { name?: string }[];
  inConsolidatedGroup: boolean;
  isLeadCase: boolean;
  consolidatedIconTooltipText: string;
  caseTitle: string;
  docketNumber: string;
  docketNumberWithSuffix?: string;
};

export const publicTrialSessionDetailHelper = (
  get: Get,
  applicationContext: ClientPublicApplicationContext,
): {
  formattedNow: string;
  formattedTrialSession: {
    trialLocation?: string;
    formattedTerm: string;
    formattedEstimatedEndDate: string;
    formattedStartDate: string;
    formattedStartDateFull: string;
    sessionStatus: string;
    formattedCityStateZip: string;
    hasCourthouseInformation: boolean;
    formattedCases: TrialSessionPublicCaseRow[];
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

  const formattedCases = Case.sortByDocketNumber(
    trialSession.calendaredCases.map(c => formatPublicCase(c)),
  );

  const formattedTrialSession = {
    formattedCases,
    formattedCityStateZip,
    formattedEstimatedEndDate,
    formattedStartDate,
    formattedStartDateFull,
    formattedTerm,
    hasCourthouseInformation,

    sessionStatus: trialSession.sessionStatus,
    // 10461 TODO: remove as needed
    trialLocation: trialSession.trialLocation,
  };

  return {
    formattedNow: formatNow(FORMATS.CURRENT_AS_OF),
    formattedTrialSession,
  };
};

const formatPublicCase = (
  calendaredCase: RawPublicCase,
): TrialSessionPublicCaseRow => {
  const { isSealed } = calendaredCase;
  const inConsolidatedGroup = isInConsolidatedGroup(calendaredCase);
  const isTheLeadCase = isLeadCase(calendaredCase);
  const caseTitle = Case.getCaseTitle(calendaredCase.caseCaption);
  let consolidatedIconTooltipText;

  if (inConsolidatedGroup) {
    if (isTheLeadCase) {
      consolidatedIconTooltipText = 'Lead case in a consolidated group';
    } else {
      consolidatedIconTooltipText = 'Member case in a consolidated group';
    }
  }

  return {
    caseTitle,
    consolidatedIconTooltipText,
    docketNumber: calendaredCase.docketNumber,
    docketNumberWithSuffix: calendaredCase.docketNumberWithSuffix,
    inConsolidatedGroup,
    irsPractitioners: calendaredCase.irsPractitioners,
    isLeadCase: isTheLeadCase,
    isSealed,
    privatePractitioners: calendaredCase.privatePractitioners,
  };
};
