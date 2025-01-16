import { Case } from '@shared/business/entities/cases/Case';
import { DOCUMENT_RELATIONSHIPS } from '@shared/business/entities/EntityConstants';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
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
  formatPetitioners,
  formatPretrialConference,
  formatRecalledRows,
  formatRemoteSession,
  formatRespondentAppearances,
  formatStatusReportOrdered,
  formatStipulatedDecision,
  formatTrialBrief,
  formatTrialHearing,
  formatWitnesses,
  getConsolidatedDocketNumbers,
} from '@web-api/business/useCaseHelper/trialSessionMinutes/formatMinuteSheet';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getMinuteSheet } from '@web-api/persistence/postgres/minuteSheets/getMinuteSheet';
import { getUniqueId } from '@shared/sharedAppContext';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

export const generateTrialSessionMinutesPdfInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, trialSessionId },
  authorizedUser: UnknownAuthUser,
): Promise<string> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MANAGE_MINUTE_SHEET)) {
    throw new UnauthorizedError('Unauthorized');
  }

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

  const minuteSheet = await getMinuteSheet({ docketNumber, trialSessionId });

  if (!minuteSheet)
    throw new NotFoundError(
      `Minute sheet for trial session ${trialSessionId} case ${docketNumber} was not found.`,
    );

  const formattedMinuteSheet = formatMinuteSheet({
    aCase,
    minuteSheetFormState: minuteSheet.content,
    trialSession,
  });

  const pdf = await applicationContext.getDocumentGenerators().minuteSheet({
    applicationContext,
    data: {
      formattedMinuteSheet,
    },
  });

  const docketEntryId = getUniqueId();
  const documentTitle = `minute-sheet-${docketEntryId}`;

  await applicationContext.getPersistenceGateway().uploadDocument({
    applicationContext,
    pdfData: pdf,
    pdfName: docketEntryId,
  });

  const { url } = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      applicationContext,
      key: docketEntryId,
    });

  // 10419 TODO consider creating an "attachAsDraft" function?
  // found myself thinking that would've been super nice to have rather than
  // trying to sus out all that needs to happen for a document to show up properly
  // as a draft.
  const documentMetadata = {
    docketNumber,
    documentTitle,
    primaryDocumentFileSize: pdf.byteLength,
  };

  const draftDocketEntry = new DocketEntry(
    {
      ...documentMetadata,
      docketEntryId,
      filedBy: authorizedUser.name,
      isDraft: true,
      isFileAttached: true,
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
    },
    { authorizedUser },
  );
  draftDocketEntry.setFiledBy(authorizedUser);

  draftDocketEntry.setAsProcessingStatusAsCompleted();

  const caseEntity = new Case(aCase, { authorizedUser });
  caseEntity.addDocketEntry(draftDocketEntry);

  await updateCaseAndAssociations({
    applicationContext,
    authorizedUser,
    caseToUpdate: caseEntity,
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
  const { docketNumberWithSuffix } = aCase;
  const docketNumbers = aCase.consolidatedCases.map(
    consolidatedCase => consolidatedCase.docketNumber,
  );
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
    formattedDocketNumbers: getConsolidatedDocketNumbers(aCase),
    judge: minuteSheetFormState.trialSessionMetadataSection.judge,
    jurisdictionRetained: formatJurisdictionRetained(
      minuteSheetFormState.jurisdictionRetainedSection,
    ),
    motions: formatMotions(minuteSheetFormState.motionsSection),
    notCalled: formatCalledSection(notCalled),
    petitionerAppearances: formatPetitionerAppearances(
      minuteSheetFormState.petitionersSection,
    ),
    petitionerWitnesses: formatWitnesses(
      minuteSheetFormState.witnessesSection.petitionerWitnesses,
    ),
    petitioners: formatPetitioners(aCase),
    pretrialConference: formatPretrialConference(pretrialConference),
    recalled: formatRecalledRows(recalled),
    remoteSession: formatRemoteSession(
      minuteSheetFormState.trialSessionMetadataSection.remoteSession,
    ),
    respondentAppearances: formatRespondentAppearances(
      minuteSheetFormState.respondentsSection,
    ),
    respondentWitnesses: formatWitnesses(
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
