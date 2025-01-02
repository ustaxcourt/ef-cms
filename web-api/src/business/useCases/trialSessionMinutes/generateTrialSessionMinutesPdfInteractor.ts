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
  judge: string;
  remoteSession: string;
  trialClerk: string;
  trialLocation: string;
  trialStartDate: string;
  docketNumbers: string;
  petitioners: string;
  petitionerAppearances: string[];
  called: FormattedCaseMetadataRow;
  notCalled: FormattedCaseMetadataRow;
  recalled: (FormattedCaseMetadataRow & { renderKey: string })[];
  pretrialConference?: FormattedCaseMetadataRow;
  trialHearing?: FormattedCaseMetadataRow & { trialHearingType: string };
  respondentAppearances: string[];
  jurisdictionRetained?: { date: string; note: string; continued: string };
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

type FormattedCaseMetadataRow = {
  date: string;
  note: string;
  transcriptOrdered: string;
};

const getBriefDetails = (briefDetails: BriefDetailsType) => {
  // TODO 10419 Handle Simultaneous Supplemental Brief
  // TODO 10419 Casing of briefSubtype isn't quite right
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

const formatMinuteSheet = ({
  aCase,
  minuteSheetFormState,
  trialSession,
}: {
  minuteSheetFormState: MinuteSheetFormState;
  trialSession: RawTrialSession;
  aCase: RawCase;
}): FormattedMinuteSheet => {
  // Is this a consolidated group?
  let docketNumbers = aCase.docketNumber;

  if (aCase.consolidatedCases.length > 0) {
    // we're in a consolidated group
    docketNumbers = aCase.consolidatedCases
      .map(consolidatedCase => consolidatedCase.docketNumber)
      .join(', ');
  }
  // if yes, get the docket numbers from each case in the consolidated group, join on commas
  // if no, just use the docket number from the case
  const petitioners = aCase.petitioners
    .map(petitioner => petitioner.name)
    .join(', ');

  const { called } = minuteSheetFormState.caseMetadataSection;
  const formattedCalled = {
    date: formatDateString(called.date, FORMATS.MMDDYYYY),
    note: called.note,
    transcriptOrdered: called.transcriptOrdered ? 'Transcript ordered' : '',
  };

  const { notCalled } = minuteSheetFormState.caseMetadataSection;
  const formattedNotCalled = {
    date: formatDateString(notCalled.date, FORMATS.MMDDYYYY),
    note: notCalled.note,
    transcriptOrdered: notCalled.transcriptOrdered ? 'Transcript ordered' : '',
  };

  const formattedRecallRows = Object.values(
    minuteSheetFormState.caseMetadataSection.recalled,
  ).map(recalledRow => {
    return {
      date: recalledRow.date,
      note: recalledRow.note,
      renderKey: recalledRow.renderKey,
      transcriptOrdered: recalledRow.transcriptOrdered
        ? 'Transcript ordered'
        : '',
    };
  });

  const { pretrialConference } = minuteSheetFormState.caseMetadataSection;
  const formattedPretrialConference = {
    date: pretrialConference.date,
    note: pretrialConference.note,
    transcriptOrdered: pretrialConference.transcriptOrdered
      ? 'Transcript ordered'
      : '',
  };

  const { trialHearing } = minuteSheetFormState.caseMetadataSection;
  const formattedTrialHearing = {
    date: trialHearing.date,
    note: trialHearing.note,
    transcriptOrdered: trialHearing.transcriptOrdered
      ? 'Transcript ordered'
      : '',
    trialHearingType: trialHearing.trialHearingType
      ? TRIAL_HEARING_OPTIONS[trialHearing.trialHearingType]
      : '',
  };

  const { petitionersSection } = minuteSheetFormState;
  const formattedPetitioners = petitionersSection.noAppearance
    ? ['No appearance']
    : Object.values(petitionersSection.petitioners).map(petitioner => {
        return `${petitioner.name} (${petitioner.role}) - ${petitioner.datesOfAppearance}`;
      });

  const { respondentsSection } = minuteSheetFormState;
  const formattedRespondents = Object.values(
    respondentsSection.respondents,
  ).map(respondent => {
    return `${respondent.name} - ${respondent.datesOfAppearance}`;
  });

  const { jurisdictionRetainedSection } = minuteSheetFormState;
  const formattedJurisdictionRetained = {
    continued: jurisdictionRetainedSection.continued ? 'Continued' : '',
    date: jurisdictionRetainedSection.date,
    note: jurisdictionRetainedSection.note,
  };

  const { statusReportOrdered } = minuteSheetFormState.ordersSection;
  const orderedFor = STATUS_REPORT_ORDERED_FOR_OPTIONS[
    statusReportOrdered.orderedFor
  ]
    ? STATUS_REPORT_ORDERED_FOR_OPTIONS[statusReportOrdered.orderedFor]
    : '';

  const formattedStatusReportOrdered = [
    formatDateString(statusReportOrdered.date, FORMATS.MMDDYYYY),
    orderedFor && `Ordered for ${orderedFor}`,
    statusReportOrdered.dueDate &&
      `Due ${formatDateString(statusReportOrdered.dueDate, FORMATS.MMDDYYYY)}`,
    statusReportOrdered.note && `<em>${statusReportOrdered.note}</em>`,
  ]
    .filter(Boolean)
    .join('; ');

  const { stipulatedDecisionOrdered } = minuteSheetFormState.ordersSection;
  const formattedStipulatedDecisionOrdered = [
    formatDateString(stipulatedDecisionOrdered.date, FORMATS.MMDDYYYY),
    stipulatedDecisionOrdered.dueDate &&
      `Due ${formatDateString(stipulatedDecisionOrdered.dueDate, FORMATS.MMDDYYYY)}`,
    stipulatedDecisionOrdered.note &&
      `<em>${stipulatedDecisionOrdered.note}</em>`,
  ]
    .filter(Boolean)
    .join('; ');

  const formattedMotions = Object.values(
    minuteSheetFormState.motionsSection.motions,
  ).map(motion => {
    return {
      content: [
        `${motion.oralMotion ? 'ORAL ' : ''}${MOTION_TYPE_OPTIONS[motion.type]}`,
        `${formatDateString(motion.date, FORMATS.MMDDYYYY)}`,
        `Filed by ${MOTION_FILED_BY_OPTIONS[motion.filedBy]}`,
        `${MOTION_STATUS_OPTIONS[motion.status]}`,
        `<em>${motion.note}</em>`,
      ].join('; '),
      motionType: MOTION_TYPE_OPTIONS[motion.type],
      renderKey: motion.renderKey,
    };
  });

  const formattedActionsAndFilings = Object.values(
    minuteSheetFormState.actionsAndFilingsSection.actionsAndFilings,
  ).map(action => {
    return {
      content: [
        formatDateString(action.date, FORMATS.MMDDYYYY),
        `${ACTION_DOCUMENT_TYPE_OPTIONS[action.documentType]}` +
          (action.note ? ` - <em>${action.note}</em>` : ''),
        ACTION_FILED_BY_OPTIONS[action.filedBy],
        ACTION_STATUS_OPTIONS[action.status],
      ].join('; '),
      renderKey: action.renderKey,
    };
  });

  const formattedTrialBrief = {
    benchOpinionRendered: [
      `${formatDateString(minuteSheetFormState.trialBriefSection.dateBenchOpinionRendered, FORMATS.MMDDYYYY)}`,
      `${minuteSheetFormState.trialBriefSection.transcriptOrdered ? 'Transcript ordered' : ''}`,
      `${minuteSheetFormState.trialBriefSection.note ? `<em>${minuteSheetFormState.trialBriefSection.note}</em>` : ''}`,
    ]
      .filter(Boolean)
      .join('; '),
    briefDetails: getBriefDetails(
      minuteSheetFormState.trialBriefSection.briefDetails,
    ),
    briefType: minuteSheetFormState.trialBriefSection.briefType,
    dateSubmitted: formatDateString(
      minuteSheetFormState.trialBriefSection.dateSubmitted,
      FORMATS.MMDDYYYY,
    ),
    totalTrialHours: minuteSheetFormState.trialBriefSection.totalTrialHours,
  };

  const formattedPetitionerWitnesses = Object.values(
    minuteSheetFormState.witnessesSection.petitionerWitnesses,
  );

  const formattedRespondentWitnesses = Object.values(
    minuteSheetFormState.witnessesSection.respondentWitnesses,
  );

  const formattedExhibits = Object.values(
    minuteSheetFormState.exhibitsSection.exhibits,
  ).map(exhibit => ({
    description: exhibit.description,
    note: exhibit.note,
    renderKey: exhibit.renderKey,
    status: EXHIBIT_STATUS_OPTIONS[exhibit.status],
  }));

  return {
    actionsAndFilings: formattedActionsAndFilings,
    called: formattedCalled,
    courtReporter:
      minuteSheetFormState.trialSessionMetadataSection.courtReporter,
    docketNumbers,
    exhibits: formattedExhibits,
    judge: minuteSheetFormState.trialSessionMetadataSection.judge,
    jurisdictionRetained: formattedJurisdictionRetained,
    motions: formattedMotions,
    notCalled: formattedNotCalled,
    petitionerAppearances: formattedPetitioners,
    petitionerWitnesses: formattedPetitionerWitnesses,
    petitioners,
    pretrialConference: formattedPretrialConference,
    recalled: formattedRecallRows,
    remoteSession: minuteSheetFormState.trialSessionMetadataSection
      .remoteSession
      ? 'Yes'
      : 'No',
    respondentAppearances: formattedRespondents,
    respondentWitnesses: formattedRespondentWitnesses,
    statusReportOrdered: formattedStatusReportOrdered,
    stipulatedDecisionOrdered: formattedStipulatedDecisionOrdered,
    trialBrief: formattedTrialBrief,
    trialClerk: minuteSheetFormState.trialSessionMetadataSection.trialClerk,
    trialHearing: formattedTrialHearing,
    trialLocation: trialSession.trialLocation!,
    trialStartDate: formatDateString(
      trialSession.startDate,
      FORMATS.MONTH_DAY_YEAR,
    ),
  };
};
