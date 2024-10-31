import { CalendaredCase } from '@shared/business/entities/cases/CalendaredCase';
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

type TrialSessionPublicCase = {
  isSealed: boolean; // TODO
  privatePractitioners: any[];
  irsPractitioners: any[];
  inConsolidatedGroup: boolean;
  isLeadCase: boolean;
  consolidatedIconTooltipText: string;
  caseTitle: string;
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

  console.log(trialSession.calendaredCases);

  // 10461 TODO: Are they already sorted?
  const formattedCases = Case.sortByDocketNumber(
    trialSession.calendaredCases.map(c => formatPublicCase(c)),
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
    // 10461 TODO: remove as needed
    trialLocation: trialSession.trialLocation,
  };

  return {
    formattedNow: formatNow(FORMATS.CURRENT_AS_OF),
    formattedTrialSession,
  };
};

// 10461 TODO: copied almost verbatim from getFormattedCaseDetail, should be exported
// but conflicts with a different export of the same name in partiesInformationHelper
const formatCounsel = ({ caseDetail, counsel }) => {
  let formattedName = counsel.name;

  if (counsel.barNumber) {
    formattedName += ` (${counsel.barNumber})`;
  }
  counsel.formattedName = formattedName;

  if (counsel.representing) {
    counsel.representingFormatted = [];

    caseDetail.petitioners?.forEach(p => {
      if (counsel.representing.includes(p.contactId)) {
        counsel.representingFormatted.push({
          name: p.name,
          secondaryName: p.secondaryName,
          title: p.title,
        });
      }
    });
  }

  return counsel;
};

// 10461 TODO: can we extend getFormattedCaseDetail
const formatPublicCase = (
  calendaredCase: ExcludeMethods<CalendaredCase>,
): TrialSessionPublicCase => {
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

  let irsPractitioners;

  if (calendaredCase.irsPractitioners) {
    irsPractitioners = calendaredCase.irsPractitioners.map(counsel => {
      return formatCounsel({ caseDetail: calendaredCase, counsel });
    });
  }

  let privatePractitioners;

  if (calendaredCase.privatePractitioners) {
    privatePractitioners = calendaredCase.privatePractitioners.map(counsel => {
      return formatCounsel({ caseDetail: calendaredCase, counsel });
    });
  }

  return {
    caseTitle,
    consolidatedIconTooltipText,
    docketNumberWithSuffix: calendaredCase.docketNumberWithSuffix,
    inConsolidatedGroup,
    irsPractitioners,
    isLeadCase: isTheLeadCase,
    isSealed,
    privatePractitioners,
  };
};
