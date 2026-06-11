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
import { RestrictedCaseDTO } from '@shared/business/dto/cases/RestrictedCaseDTO';
import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
type CalendaredPublicCase = PublicCaseDTO | RestrictedCaseDTO;

export type FormattedPublicTrialSession = {
  formattedStartDate: string;
  formattedStartDateFull: string;

  hasCourthouseInformation: boolean;
  formattedCityStateZip: string;
  trialLocation?: string;
  courthouseName?: string;
  address1?: string;
  address2?: string;

  isSwingSession: boolean;
  swingSessionLocation?: string;
  swingSessionId?: string;

  formattedCases: TrialSessionPublicCaseRow[];
};

export type TrialSessionPublicCaseRow = {
  caseTitle: string;
  consolidatedIconTooltipText: string;
  docketNumber: string;
  docketNumberWithSuffix?: string;
  inConsolidatedGroup: boolean;
  irsPractitioners?: { name?: string }[];
  isLeadCase: boolean;
  isSealed: boolean;
  privatePractitioners?: { name?: string }[];
};

export const publicTrialSessionDetailsHelper = (
  get: Get,
  applicationContext: ClientPublicApplicationContext,
): {
  formattedNow: string;
  formattedTrialSession: FormattedPublicTrialSession;
} => {
  const trialSession = get(state.trialSessionDetailsPage.trialSession);

  const formattedStartDate = applicationContext
    .getUtilities()
    .formatDateString(trialSession.startDate, 'MMDDYY');

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

  const formattedCases =
    Case.sortByDocketNumberAndGroupConsolidatedCases<CalendaredPublicCase>(
      trialSession.calendaredCases,
    ).map(formatPublicCase);

  const formattedTrialSession = {
    address1: trialSession.address1,
    address2: trialSession.address2,
    courthouseName: trialSession.courthouseName,
    formattedCases,
    formattedCityStateZip,
    formattedStartDate,
    formattedStartDateFull,
    hasCourthouseInformation,
    isSwingSession: !!trialSession.swingSessionId,
    swingSessionId: trialSession.swingSessionId,
    swingSessionLocation: trialSession.swingSessionLocation,
    trialLocation: trialSession.trialLocation,
  };

  return {
    formattedNow: formatNow(FORMATS.CURRENT_AS_OF_TIMESTAMP),
    formattedTrialSession,
  };
};

const isPublicCaseDTO = (
  calendaredCase: CalendaredPublicCase,
): calendaredCase is PublicCaseDTO => {
  return calendaredCase.entityName === 'PublicCaseDTO';
};

const formatPublicCase = (
  calendaredCase: CalendaredPublicCase,
): TrialSessionPublicCaseRow => {
  const { isSealed } = calendaredCase;
  const inConsolidatedGroup = isInConsolidatedGroup(calendaredCase);
  const isTheLeadCase = isLeadCase(calendaredCase);
  const caseTitle = isSealed
    ? 'Sealed' // if the case is sealed, it will be a 'RestrictedCaseDTO'
    : Case.getCaseTitle(
        isPublicCaseDTO(calendaredCase) ? calendaredCase.caseCaption : '',
      );
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
    irsPractitioners: isPublicCaseDTO(calendaredCase)
      ? calendaredCase.irsPractitioners
      : undefined,
    isLeadCase: isTheLeadCase,
    isSealed: !!isSealed,
    privatePractitioners: isPublicCaseDTO(calendaredCase)
      ? calendaredCase.privatePractitioners
      : undefined,
  };
};
