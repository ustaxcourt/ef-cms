import { MinuteSheet } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';

const recordToSortedArray = <T extends { renderKey: string }>(
  record: Record<string, T>,
): Omit<T, 'renderKey'>[] => {
  return Object.values(record)
    .sort((a, b) => (a.renderKey > b.renderKey ? 1 : -1))
    .map(({ renderKey, ...rest }) => rest);
};

export const transformFormStateToMinuteSheet = (
  formState: MinuteSheetFormState,
  trialSessionId: string,
  docketNumber: string,
): MinuteSheet => {
  const {
    trialSessionMetadataSection,
    caseMetadataSection,
    petitionersSection,
    respondentsSection,
    jurisdictionSection,
    ordersSection,
    motionsSection,
    actionsAndFilingsSection,
    trialBriefSection,
    witnessesSection,
    exhibitsSection,
  } = formState;

  return {
    trialSessionId,
    docketNumber,
    judge: trialSessionMetadataSection.judge,
    trialClerk: trialSessionMetadataSection.trialClerk,
    courtReporter: trialSessionMetadataSection.courtReporter,
    isRemoteSession: trialSessionMetadataSection.remoteSession,

    caseCalendarCallDate: caseMetadataSection.called.date,
    caseCalendarCallNote: caseMetadataSection.called.note,
    caseCalendarCallTranscriptOrdered:
      caseMetadataSection.called.transcriptOrdered || false,
    caseNotCalledDate: caseMetadataSection.notCalled.date,
    caseNotCalledNote: caseMetadataSection.notCalled.note,
    caseRecalls: recordToSortedArray(caseMetadataSection.recalled),
    pretrialConferenceDate: caseMetadataSection.pretrialConference.date,
    pretrialConferenceNote: caseMetadataSection.pretrialConference.note,
    pretrialConferenceTranscriptOrdered:
      caseMetadataSection.pretrialConference.transcriptOrdered || false,
    trialHearingDate: caseMetadataSection.trialHearing.date,
    trialHearingNote: caseMetadataSection.trialHearing.note,
    trialHearingTranscriptOrdered:
      caseMetadataSection.trialHearing.transcriptOrdered || false,
    trialHearingTytpe:
      caseMetadataSection.trialHearing.trialHearingType || 'trial',

    petitionerNoAppearance: petitionersSection.noAppearance,
    petitionerAppearances: recordToSortedArray(petitionersSection.petitioners),
    respondentAppearances: recordToSortedArray(respondentsSection.respondents),

    jurisdictionRetainedDate: jurisdictionSection.retained.date,
    jurisdictionRetainedNote: jurisdictionSection.retained.note,
    jurisdictionContinuedDate: jurisdictionSection.continued.date,
    jurisdictionContinuedNote: jurisdictionSection.continued.note,

    statusReportOrderedDate: ordersSection.statusReportOrdered.date,
    statusReportOrderedNote: ordersSection.statusReportOrdered.note,
    statusReportOrderedDueDate: ordersSection.statusReportOrdered.dueDate,
    statusReportOrderedFor: ordersSection.statusReportOrdered.orderedFor,
    stipulatedDecisionOrderedDate: ordersSection.stipulatedDecisionOrdered.date,
    stipulatedDecisionOrderedNote: ordersSection.stipulatedDecisionOrdered.note,
    stipulatedDecisionOrderedDueDate:
      ordersSection.stipulatedDecisionOrdered.dueDate,

    motions: recordToSortedArray(motionsSection.motions),
    actionsAndFilings: recordToSortedArray(
      actionsAndFilingsSection.actionsAndFilings,
    ),

    trialBriefSubmittedDate: trialBriefSection.dateSubmitted,
    totalTrialHours: trialBriefSection.totalTrialHours,
    benchOpinionRenderedDate: trialBriefSection.dateBenchOpinionRendered,
    trialBriefTranscriptOrdered: trialBriefSection.transcriptOrdered,
    trialBriefNote: trialBriefSection.note,
    trialBriefType: trialBriefSection.briefType,
    trialBriefDetails: trialBriefSection.briefDetails,

    petitionerWitnesses: recordToSortedArray(
      witnessesSection.petitionerWitnesses,
    ),
    respondentWitnesses: recordToSortedArray(
      witnessesSection.respondentWitnesses,
    ),
    exhibits: recordToSortedArray(exhibitsSection.exhibits),
  };
};
