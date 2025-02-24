import { state } from '@web-client/presenter/app.cerebral';
import { updateMinuteSheetInteractor } from '@shared/proxies/trialSessionMinutes/updateMinuteSheetProxy';
import { MinuteSheet } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import hash from 'object-hash';
import { recordToSortedArray } from '@web-client/utilities/recordToSortedArray';

export const autosaveTrialSessionMinuteSheetAction = async ({
  get,
  props,
  store,
}) => {
  const caseDetail = get(state.caseDetail);
  const trialSession = get(state.trialSession);
  const currentMinuteSheetFormState = get(state.minuteSheetForm);

  const { forceAutosave } = props;
  const oldMinuteSheetFormStateSnapshot = get(state.minuteSheetFormSnapshot);
  const currentMinuteSheetFormStateSnapshot = hash(currentMinuteSheetFormState);
  const hasFormChanged =
    oldMinuteSheetFormStateSnapshot !== currentMinuteSheetFormStateSnapshot;
  let updateMinuteSheetFormState;
  if (hasFormChanged || forceAutosave) {
    const transformedMinuteSheet = transformFormStateToMinuteSheet(
      currentMinuteSheetFormState,
      trialSession.trialSessionId,
      caseDetail.docketNumber,
    );

    updateMinuteSheetFormState = await updateMinuteSheetInteractor({
      docketNumber: caseDetail.docketNumber,
      minuteSheet: transformedMinuteSheet,
      trialSessionId: trialSession.trialSessionId,
    });

    store.set(state.minuteSheetFormSnapshot, updateMinuteSheetFormState);
  }
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
    trialSession: {
      id: trialSessionId,
      judge: trialSessionMetadataSection.judge,
      trialClerk: trialSessionMetadataSection.trialClerk,
      courtReporter: trialSessionMetadataSection.courtReporter,
      isRemote: trialSessionMetadataSection.remoteSession,
    },

    caseRecord: {
      docketNumber,
      calendarCall: {
        date: caseMetadataSection.called.date,
        note: caseMetadataSection.called.note,
        transcriptOrdered: caseMetadataSection.called.transcriptOrdered,
      },
      notCalled: {
        date: caseMetadataSection.notCalled.date,
        note: caseMetadataSection.notCalled.note,
      },
      recalls: recordToSortedArray(caseMetadataSection.recalled),
      pretrialConference: {
        date: caseMetadataSection.pretrialConference.date,
        note: caseMetadataSection.pretrialConference.note,
        transcriptOrdered:
          caseMetadataSection.pretrialConference.transcriptOrdered,
      },
      trialHearing: {
        date: caseMetadataSection.trialHearing.date,
        note: caseMetadataSection.trialHearing.note,
        transcriptOrdered: caseMetadataSection.trialHearing.transcriptOrdered,
        trialHearingType: caseMetadataSection.trialHearing.trialHearingType,
      },
    },

    appearances: {
      petitioners: {
        noAppearance: petitionersSection.noAppearance,
        appearances: recordToSortedArray(petitionersSection.petitioners),
      },
      respondents: recordToSortedArray(respondentsSection.respondents),
    },

    jurisdiction: {
      retained: {
        date: jurisdictionSection.retained.date,
        note: jurisdictionSection.retained.note,
      },
      continued: {
        date: jurisdictionSection.continued.date,
        note: jurisdictionSection.continued.note,
      },
    },

    orders: {
      statusReport: {
        date: ordersSection.statusReportOrdered.date,
        dueDate: ordersSection.statusReportOrdered.dueDate,
        note: ordersSection.statusReportOrdered.note,
        orderedFor: ordersSection.statusReportOrdered.orderedFor,
      },
      stipulatedDecision: {
        date: ordersSection.stipulatedDecisionOrdered.date,
        dueDate: ordersSection.stipulatedDecisionOrdered.dueDate,
        note: ordersSection.stipulatedDecisionOrdered.note,
      },
    },

    proceedings: {
      motions: recordToSortedArray(motionsSection.motions),
      actionsAndFilings: recordToSortedArray(
        actionsAndFilingsSection.actionsAndFilings,
      ),
    },

    brief: {
      type: trialBriefSection.briefType,
      details: trialBriefSection.briefDetails,
      dateSubmitted: trialBriefSection.dateSubmitted
        ? trialBriefSection.dateSubmitted
        : undefined,
      hoursOfTrial: trialBriefSection.totalTrialHours,
      benchOpinionDate: trialBriefSection.dateBenchOpinionRendered
        ? trialBriefSection.dateBenchOpinionRendered
        : undefined,
      transcriptOrdered: trialBriefSection.transcriptOrdered,
      note: trialBriefSection.note,
    },

    evidence: {
      petitionerWitnesses: recordToSortedArray(
        witnessesSection.petitionerWitnesses,
      ),
      respondentWitnesses: recordToSortedArray(
        witnessesSection.respondentWitnesses,
      ),
      exhibits: recordToSortedArray(exhibitsSection.exhibits),
    },
  };
};
