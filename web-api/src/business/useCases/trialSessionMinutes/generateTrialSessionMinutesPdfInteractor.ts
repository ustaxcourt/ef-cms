// import {
//   ROLE_PERMISSIONS,
//   isAuthorized,
// } from '@shared/authorization/authorizationClientService';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import {
  MinuteSheetFormState,
  STATUS_REPORT_ORDERED_FOR_OPTIONS,
  TRIAL_HEARING_OPTIONS,
} from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
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
  statusReportOrdered: string[];
  stipulatedDecisionOrdered: {
    date: string;
    dateDue: string;
    note: string;
  };
  // statusReport?: string;
  // motions?: Array<{
  //   type: string;
  //   details: string;
  // }>;
  // otherFilings?: string;
  // generatedDate: string;
};

type FormattedCaseMetadataRow = {
  date: string;
  note: string;
  transcriptOrdered: string;
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
  console.log('consolidatedCases', aCase.consolidatedCases);
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

  // TODO 10419 We should discuss whether or not we like this pattern
  // It relies on dangerouslySetInnerHTML to render the note as HTML for italics,
  // but it does make the jsx significantly simpler
  // Nate sez: As much as I was harping on markup in this format function, I think the tradeoff may be worth it.
  const formattedStatusReportOrdered = [
    formatDateString(statusReportOrdered.date, FORMATS.MMDDYYYY),
    orderedFor && `Ordered for ${orderedFor}`,
    statusReportOrdered.dueDate &&
      `Due ${formatDateString(statusReportOrdered.dueDate, FORMATS.MMDDYYYY)}`,
    statusReportOrdered.note && `<em>${statusReportOrdered.note}</em>`,
  ].filter(Boolean);

  const { stipulatedDecisionOrdered } = minuteSheetFormState.ordersSection;
  const formattedStipulatedDecisionOrdered = {
    date: formatDateString(stipulatedDecisionOrdered.date, FORMATS.MMDDYYYY),
    dateDue: formatDateString(
      stipulatedDecisionOrdered.dueDate,
      FORMATS.MMDDYYYY,
    ),
    note: stipulatedDecisionOrdered.note,
  };

  return {
    called: formattedCalled,
    courtReporter:
      minuteSheetFormState.trialSessionMetadataSection.courtReporter,
    docketNumbers,
    judge: minuteSheetFormState.trialSessionMetadataSection.judge,
    jurisdictionRetained: formattedJurisdictionRetained,
    notCalled: formattedNotCalled,
    petitionerAppearances: formattedPetitioners,
    petitioners,
    pretrialConference: formattedPretrialConference,
    recalled: formattedRecallRows,
    remoteSession: minuteSheetFormState.trialSessionMetadataSection
      .remoteSession
      ? 'Yes'
      : 'No',
    respondentAppearances: formattedRespondents,
    statusReportOrdered: formattedStatusReportOrdered,
    stipulatedDecisionOrdered: formattedStipulatedDecisionOrdered,
    trialClerk: minuteSheetFormState.trialSessionMetadataSection.trialClerk,
    trialHearing: formattedTrialHearing,
    trialLocation: trialSession.trialLocation!,
    trialStartDate: formatDateString(
      trialSession.startDate,
      FORMATS.MONTH_DAY_YEAR,
    ),
  };
};
