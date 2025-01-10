// import {
//   ROLE_PERMISSIONS,
//   isAuthorized,
// } from '@shared/authorization/authorizationClientService';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import {
  FormattedMinuteSheet,
  formatActionsAndFilings,
  formatCalledSection,
  formatExhibits,
  formatJurisdictionRetained,
  formatMotions,
  formatPetitionerAppearances,
  formatPretrialConference,
  formatRecalledRows,
  formatRespondentAppearances,
  formatStatusReportOrdered,
  formatStipulatedDecision,
  formatTrialBrief,
  formatTrialHearing,
  getConsolidatedDocketNumbers,
} from '@web-api/business/useCaseHelper/trialSessionMinutes/formatMinuteSheet';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
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

  // 10419 TODO: rework this call so that it does not know it's coming from dynamo
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
    exhibits: formatExhibits(minuteSheetFormState.exhibitsSection),
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
    ).filter(witness => !!witness.name),
    petitioners,
    pretrialConference: formatPretrialConference(pretrialConference),
    recalled: formatRecalledRows(recalled),
    remoteSession: minuteSheetFormState.trialSessionMetadataSection
      .remoteSession
      ? 'Yes'
      : 'No',
    respondentAppearances: formatRespondentAppearances(
      minuteSheetFormState.respondentsSection,
    ),
    respondentWitnesses: Object.values(
      minuteSheetFormState.witnessesSection.respondentWitnesses,
    ).filter(witness => !!witness.name),
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
