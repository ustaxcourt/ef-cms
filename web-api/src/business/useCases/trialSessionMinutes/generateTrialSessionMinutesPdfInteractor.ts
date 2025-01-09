// import {
//   ROLE_PERMISSIONS,
//   isAuthorized,
// } from '@shared/authorization/authorizationClientService';
import {
  ACTION_DOCUMENT_TYPE_OPTIONS,
  ACTION_FILED_BY_OPTIONS,
  ACTION_STATUS_OPTIONS,
  BriefDetailsType,
  EXHIBIT_STATUS_OPTIONS,
  ExhibitStatusOption,
  MOTION_FILED_BY_OPTIONS,
  MOTION_STATUS_OPTIONS,
  MOTION_TYPE_OPTIONS,
  MinuteSheetFormState,
  STATUS_REPORT_ORDERED_FOR_OPTIONS,
  TRIAL_HEARING_OPTIONS,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { query } from '@web-api/persistence/dynamodbClientService';
// import { UnauthorizedError } from '@web-api/errors/errors';
// import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const generateTrialSessionMinutesPdfInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, trialSessionId },
  // authorizedUser: UnknownAuthUser,
): Promise<string> => {
  // 10419 TODO: add role-permissions configuration for minutes sheet
  //   if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MINUTES_SHEET)) {
  //     throw new UnauthorizedError('Unauthorized');
  //   }

  const results = await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${trialSessionId}|${docketNumber}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  const aCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  if (!aCase || !trialSession) {
    throw new Error('Case and trial session could not be retrieved');
  }

  const formattedMinuteSheet = formatMinuteSheet({
    aCase,
    minuteSheetFormState: JSON.parse(results[0].minuteSheet),
    trialSession,
  });

  const pdf = await applicationContext.getDocumentGenerators().minuteSheet({
    applicationContext,
    data: {
      formattedMinuteSheet,
    },
  });

  const key = `minutes-sheet-${applicationContext.getUniqueId()}.pdf`;

  await applicationContext.getPersistenceGateway().uploadDocument({
    applicationContext,
    pdfData: pdf,
    pdfName: key,
    useTempBucket: true,
  });

  const { url } = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      applicationContext,
      key,
      useTempBucket: true,
    });

  return url;
};

export type FormattedMinuteSheet = {
  courtReporter: string;
  docketNumbers: string[];
  docketNumberWithSuffix?: string;
  judge: string;
  remoteSession: string;
  trialClerk: string;
  trialLocation: string;
  trialStartDate: string;
  formattedDocketNumbers: string;
  petitioners: string;
  petitionerAppearances: string[];
  called: string;
  notCalled: string;
  recalled: { renderKey: string; content: string }[];
  pretrialConference?: string;
  trialHearing?: string;
  respondentAppearances: string[];
  jurisdictionRetained?: string;
  statusReportOrdered: string;
  stipulatedDecisionOrdered: string;
  motions: {
    motionType: string;
    renderKey: string;
    content: string;
  }[];
  actionsAndFilings: {
    renderKey: string;
    content: string;
  }[];
  trialBrief: {
    dateSubmitted: string;
    benchOpinionRendered: string;
    totalTrialHours: number;
    briefType: string;
    briefDetails: string[];
  };
  petitionerWitnesses: { renderKey: string; name: string }[];
  respondentWitnesses: { renderKey: string; name: string }[];
  exhibits: {
    renderKey: string;
    description: string;
    status: ExhibitStatusOption;
    note: string;
  }[];
};

const getBriefDetails = (briefDetails: BriefDetailsType) => {
  // 10419 TODO Handle Simultaneous Supplemental Brief
  // 10419 TODO Casing of briefSubtype isn't quite right
  const briefSubtypes = Object.keys(briefDetails);
  return briefSubtypes.map(briefSubtype => {
    const briefDetail = briefDetails[briefSubtype];
    return [
      `${briefSubtype} - ${briefDetail.partyType}`,
      `Due ${formatDateString(briefDetail.dueDate, FORMATS.MMDDYYYY)}`,
      `${briefDetail.note ? `<em>${briefDetail.note}</em>` : ''}`,
    ]
      .filter(Boolean)
      .join('; ');
  });
};

const getConsolidatedDocketNumbers = (aCase: RawCase): string => {
  if (aCase.consolidatedCases.length === 0) {
    return aCase.docketNumber;
  }
  return aCase.consolidatedCases
    .map(consolidatedCase => consolidatedCase.docketNumber)
    .join(', ');
};

const formatCalledSection = (section: {
  date: string;
  note?: string;
  transcriptOrdered?: boolean;
}): string => {
  return [
    formatDateString(section.date, FORMATS.MMDDYYYY),
    section.note && `<em>${section.note}</em>`,
    section.transcriptOrdered ? 'Transcript ordered' : '',
  ]
    .filter(Boolean)
    .join('; ');
};

const formatPetitionerAppearances = (petitionersSection: any): string[] => {
  return petitionersSection.noAppearance
    ? ['No appearance']
    : Object.values(petitionersSection.petitioners).map(
        (petitioner: any) =>
          `${petitioner.name} (${petitioner.role}) - ${petitioner.datesOfAppearance}`,
      );
};

const formatRespondentAppearances = (respondentsSection: any): string[] => {
  return Object.values(respondentsSection.respondents).map(
    (respondent: any) => `${respondent.name} - ${respondent.datesOfAppearance}`,
  );
};

const formatJurisdictionRetained = (section: any): string => {
  return [
    `${section.continued ? 'Continued - ' : ''}${formatDateString(
      section.date,
      FORMATS.MMDDYYYY,
    )}`,
    `<em>${section.note}</em>`,
  ]
    .filter(Boolean)
    .join('; ');
};

const formatStatusReportOrdered = (section: any): string => {
  const orderedFor =
    STATUS_REPORT_ORDERED_FOR_OPTIONS[section.orderedFor] || '';
  return [
    formatDateString(section.date, FORMATS.MMDDYYYY),
    orderedFor && `Ordered for ${orderedFor}`,
    section.dueDate &&
      `Due ${formatDateString(section.dueDate, FORMATS.MMDDYYYY)}`,
    section.note && `<em>${section.note}</em>`,
  ]
    .filter(Boolean)
    .join('; ');
};

const formatStipulatedDecision = (section: any): string => {
  return [
    formatDateString(section.date, FORMATS.MMDDYYYY),
    section.dueDate &&
      `Due ${formatDateString(section.dueDate, FORMATS.MMDDYYYY)}`,
    section.note && `<em>${section.note}</em>`,
  ]
    .filter(Boolean)
    .join('; ');
};

const formatMotions = (motionsSection: any) => {
  return Object.values(motionsSection.motions).map((motion: any) => ({
    content: [
      `${motion.oralMotion ? 'ORAL ' : ''}${MOTION_TYPE_OPTIONS[motion.type]}`,
      formatDateString(motion.date, FORMATS.MMDDYYYY),
      `Filed by ${MOTION_FILED_BY_OPTIONS[motion.filedBy]}`,
      MOTION_STATUS_OPTIONS[motion.status],
      `<em>${motion.note}</em>`,
    ]
      .filter(Boolean)
      .join('; '),
    motionType: MOTION_TYPE_OPTIONS[motion.type],
    renderKey: motion.renderKey,
  }));
};

const formatActionsAndFilings = (section: any) => {
  return Object.values(section.actionsAndFilings).map((action: any) => ({
    content: [
      formatDateString(action.date, FORMATS.MMDDYYYY),
      `${ACTION_DOCUMENT_TYPE_OPTIONS[action.documentType]}${
        action.note ? ` - <em>${action.note}</em>` : ''
      }`,
      ACTION_FILED_BY_OPTIONS[action.filedBy],
      ACTION_STATUS_OPTIONS[action.status],
    ]
      .filter(Boolean)
      .join('; '),
    renderKey: action.renderKey,
  }));
};

const formatTrialBrief = (section: any) => {
  return {
    benchOpinionRendered: [
      formatDateString(section.dateBenchOpinionRendered, FORMATS.MMDDYYYY),
      section.transcriptOrdered ? 'Transcript ordered' : '',
      section.note ? `<em>${section.note}</em>` : '',
    ]
      .filter(Boolean)
      .join('; '),
    briefDetails: getBriefDetails(section.briefDetails),
    briefType: section.briefType,
    dateSubmitted: formatDateString(section.dateSubmitted, FORMATS.MMDDYYYY),
    totalTrialHours: section.totalTrialHours,
  };
};

const formatPretrialConference = (section: any): string => {
  return [
    section.date,
    section.note && `<em>${section.note}</em>`,
    section.transcriptOrdered ? 'Transcript ordered' : '',
  ]
    .filter(Boolean)
    .join('; ');
};

const formatTrialHearing = (section: any): string => {
  return [
    section.date,
    section.trialHearingType && TRIAL_HEARING_OPTIONS[section.trialHearingType],
    section.note && `<em>${section.note}</em>`,
    section.transcriptOrdered ? 'Transcript ordered' : '',
  ]
    .filter(Boolean)
    .join('; ');
};

const formatRecalledRow = (section: any) => {
  return {
    content: [
      section.date,
      section.note && `<em>${section.note}</em>`,
      section.transcriptOrdered ? 'Transcript ordered' : '',
    ]
      .filter(Boolean)
      .join('; '),
    renderKey: section.renderKey,
  };
};

// TODO 10419: consider moving this to a helper?
const formatMinuteSheet = ({
  aCase,
  minuteSheetFormState,
  trialSession,
}: {
  minuteSheetFormState: MinuteSheetFormState;
  trialSession: RawTrialSession;
  aCase: RawCase;
}): FormattedMinuteSheet => {
  const formattedDocketNumbers = getConsolidatedDocketNumbers(aCase);
  const petitioners = aCase.petitioners
    .map(petitioner => petitioner.name)
    .join(', ');
  const docketNumbers = aCase.consolidatedCases.map(
    consolidatedCase => consolidatedCase.docketNumber,
  );

  const { docketNumberWithSuffix } = aCase;

  const { called, notCalled, pretrialConference, recalled, trialHearing } =
    minuteSheetFormState.caseMetadataSection;

  return {
    actionsAndFilings: formatActionsAndFilings(
      minuteSheetFormState.actionsAndFilingsSection,
    ),
    called: formatCalledSection(called),
    courtReporter:
      minuteSheetFormState.trialSessionMetadataSection.courtReporter,
    docketNumberWithSuffix,
    docketNumbers,
    exhibits: Object.values(minuteSheetFormState.exhibitsSection.exhibits).map(
      exhibit => ({
        description: exhibit.description,
        note: exhibit.note,
        renderKey: exhibit.renderKey,
        status: EXHIBIT_STATUS_OPTIONS[exhibit.status],
      }),
    ),
    formattedDocketNumbers,
    judge: minuteSheetFormState.trialSessionMetadataSection.judge,
    jurisdictionRetained: formatJurisdictionRetained(
      minuteSheetFormState.jurisdictionRetainedSection,
    ),
    motions: formatMotions(minuteSheetFormState.motionsSection),
    notCalled: formatCalledSection(notCalled),
    petitionerAppearances: formatPetitionerAppearances(
      minuteSheetFormState.petitionersSection,
    ),
    petitionerWitnesses: Object.values(
      minuteSheetFormState.witnessesSection.petitionerWitnesses,
    ),
    petitioners,
    pretrialConference: formatPretrialConference(pretrialConference),
    recalled: Object.values(recalled).map(row => formatRecalledRow(row)),
    remoteSession: minuteSheetFormState.trialSessionMetadataSection
      .remoteSession
      ? 'Yes'
      : 'No',
    respondentAppearances: formatRespondentAppearances(
      minuteSheetFormState.respondentsSection,
    ),
    respondentWitnesses: Object.values(
      minuteSheetFormState.witnessesSection.respondentWitnesses,
    ),
    statusReportOrdered: formatStatusReportOrdered(
      minuteSheetFormState.ordersSection.statusReportOrdered,
    ),
    stipulatedDecisionOrdered: formatStipulatedDecision(
      minuteSheetFormState.ordersSection.stipulatedDecisionOrdered,
    ),
    trialBrief: formatTrialBrief(minuteSheetFormState.trialBriefSection),
    trialClerk: minuteSheetFormState.trialSessionMetadataSection.trialClerk,
    trialHearing: formatTrialHearing(trialHearing),
    trialLocation: trialSession.trialLocation!,
    trialStartDate: formatDateString(
      trialSession.startDate,
      FORMATS.MONTH_DAY_YEAR,
    ),
  };
};
