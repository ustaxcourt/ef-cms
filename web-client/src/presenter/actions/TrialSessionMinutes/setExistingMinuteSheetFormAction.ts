import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { arrayToKeyedRecord } from '@web-client/utilities/arrayToKeyedRecord';
import {
  Judge,
  MinuteSheet,
} from '@shared/business/entities/trialSessionMinutes/MinuteSheet';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import {
  BriefTypeOption,
  StatusReportOrderedForOption,
} from '@shared/business/entities/EntityConstants';

export const setExistingMinuteSheetFormAction = ({ props, store }) => {
  const { minuteSheet, judgeOptions } = props;

  const minuteSheetForm = transformMinuteSheetToFormState(
    minuteSheet,
    judgeOptions,
  );

  store.set(state.minuteSheetForm, cloneDeep(minuteSheetForm));
};

const transformMinuteSheetToFormState = (
  minuteSheet: MinuteSheet,
  judgeOptions: Record<string, Judge>,
): MinuteSheetFormState => ({
  actionsAndFilingsSection: {
    actionsAndFilings: arrayToKeyedRecord(
      minuteSheet.proceedings.actionsAndFilings,
    ),
  },
  caseMetadataSection: transformCaseMetadataSection(minuteSheet),
  exhibitsSection: {
    exhibits: arrayToKeyedRecord(minuteSheet.evidence.exhibits),
  },
  jurisdictionSection: transformJurisdictionSection(minuteSheet),
  motionsSection: {
    motions: arrayToKeyedRecord(minuteSheet.proceedings.motions),
  },
  ordersSection: transformOrdersSection(minuteSheet),
  petitionersSection: transformPetitionersSection(minuteSheet),
  respondentsSection: {
    respondents: arrayToKeyedRecord(minuteSheet.appearances.respondents),
  },
  trialBriefSection: transformTrialBriefSection(minuteSheet),
  trialSessionMetadataSection:
    transformTrialSessionMetadataSection(minuteSheet),
  witnessesSection: {
    petitionerWitnesses: arrayToKeyedRecord(
      minuteSheet.evidence.petitionerWitnesses,
    ),
    respondentWitnesses: arrayToKeyedRecord(
      minuteSheet.evidence.respondentWitnesses,
    ),
  },
  options: {
    irsPractitionerOptions: [],
    judgeOptions,
  },
});

// eslint-disable-next-line complexity
const transformCaseMetadataSection = (minuteSheet: MinuteSheet) => ({
  called: {
    date: minuteSheet.caseRecord.calendarCall?.date || '',
    note: minuteSheet.caseRecord.calendarCall?.note || '',
    transcriptOrdered:
      minuteSheet.caseRecord.calendarCall?.transcriptOrdered || false,
  },
  notCalled: {
    date: minuteSheet.caseRecord.notCalled?.date || '',
    note: minuteSheet.caseRecord.notCalled?.note || '',
  },
  pretrialConference: {
    date: minuteSheet.caseRecord.pretrialConference?.date || '',
    note: minuteSheet.caseRecord.pretrialConference?.note || '',
    transcriptOrdered:
      minuteSheet.caseRecord.pretrialConference?.transcriptOrdered || false,
  },
  recalled: arrayToKeyedRecord(minuteSheet.caseRecord.recalls || []),
  trialHearing: {
    date: minuteSheet.caseRecord.trialHearing?.date || '',
    note: minuteSheet.caseRecord.trialHearing?.note || '',
    transcriptOrdered:
      minuteSheet.caseRecord.trialHearing?.transcriptOrdered || false,
    trialHearingType: minuteSheet.caseRecord.trialHearing?.trialHearingType,
  },
});

const transformJurisdictionSection = (minuteSheet: MinuteSheet) => ({
  continued: {
    date: minuteSheet.jurisdiction.continued?.date || '',
    note: minuteSheet.jurisdiction.continued?.note || '',
  },
  retained: {
    date: minuteSheet.jurisdiction.retained?.date || '',
    note: minuteSheet.jurisdiction.retained?.note || '',
  },
});

const transformOrdersSection = (minuteSheet: MinuteSheet) => ({
  statusReportOrdered: {
    date: minuteSheet.orders.statusReport?.date || '',
    dueDate: minuteSheet.orders.statusReport?.dueDate || '',
    note: minuteSheet.orders.statusReport?.note || '',
    orderedFor:
      minuteSheet.orders.statusReport?.orderedFor ||
      ('' as StatusReportOrderedForOption),
  },
  stipulatedDecisionOrdered: {
    date: minuteSheet.orders.stipulatedDecision?.date || '',
    dueDate: minuteSheet.orders.stipulatedDecision?.dueDate || '',
    note: minuteSheet.orders.stipulatedDecision?.note || '',
  },
});

const transformPetitionersSection = (minuteSheet: MinuteSheet) => ({
  noAppearance: minuteSheet.appearances.petitioners.noAppearance,
  petitioners: arrayToKeyedRecord(
    minuteSheet.appearances.petitioners.appearances,
  ),
});

const transformTrialBriefSection = (minuteSheet: MinuteSheet) => ({
  briefDetails: minuteSheet.brief.details || {},
  briefType: minuteSheet.brief.type || ('' as BriefTypeOption),
  dateBenchOpinionRendered: minuteSheet.brief.benchOpinionDate || '',
  dateSubmitted: minuteSheet.brief.dateSubmitted || '',
  note: minuteSheet.brief.note || '',
  totalTrialHours: minuteSheet.brief.hoursOfTrial,
  transcriptOrdered: minuteSheet.brief.transcriptOrdered || false,
});

const transformTrialSessionMetadataSection = (minuteSheet: MinuteSheet) => ({
  courtReporter: minuteSheet.trialSession.courtReporter,
  judge: minuteSheet.trialSession.judge,
  remoteSession: minuteSheet.trialSession.isRemote,
  trialClerk: minuteSheet.trialSession.trialClerk,
});
