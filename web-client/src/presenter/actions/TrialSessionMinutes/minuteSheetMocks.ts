import {
  BriefTypeOption,
  StatusReportOrderedForOption,
} from '@shared/business/entities/EntityConstants';
import { MinuteSheet } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';

export const mockMinuteSheet: MinuteSheet = {
  trialSession: {
    id: 'trial-123',
    judge: { fullName: '', title: '', userId: '' },
    trialClerk: '',
    courtReporter: '',
    isRemote: false,
  },
  caseRecord: {
    docketNumber: '123-45',
    calendarCall: undefined,
    notCalled: undefined,
    recalls: [],
    pretrialConference: undefined,
    trialHearing: undefined,
  },
  appearances: {
    petitioners: { noAppearance: false, appearances: [] },
    respondents: [],
  },
  jurisdiction: {
    retained: { date: '', note: '' },
    continued: { date: '', note: '' },
  },
  orders: {
    statusReport: { date: '', dueDate: '', note: '', orderedFor: '' },
    stipulatedDecision: { date: '', dueDate: '', note: '' },
  },
  proceedings: { motions: [], actionsAndFilings: [] },
  brief: {
    type: '',
    details: {},
    dateSubmitted: undefined,
    hoursOfTrial: undefined,
    benchOpinionDate: undefined,
    transcriptOrdered: false,
    note: '',
  },
  evidence: { petitionerWitnesses: [], respondentWitnesses: [], exhibits: [] },
};

export const mockMinuteSheetFormState: MinuteSheetFormState = {
  actionsAndFilingsSection: { actionsAndFilings: {} },
  caseMetadataSection: {
    called: { date: '', note: '', transcriptOrdered: false },
    notCalled: { date: '', note: '' },
    pretrialConference: { date: '', note: '', transcriptOrdered: false },
    recalled: {},
    trialHearing: { date: '', note: '', transcriptOrdered: false },
  },
  exhibitsSection: { exhibits: {} },
  jurisdictionSection: {
    continued: { date: '', note: '' },
    retained: { date: '', note: '' },
  },
  motionsSection: { motions: {} },
  options: {
    irsPractitionerOptions: [{ label: '', value: '' }],
    judgeOptions: { 1: { fullName: '', title: '', userId: '1' } },
  },
  ordersSection: {
    statusReportOrdered: {
      date: '',
      dueDate: '',
      note: '',
      orderedFor: '' as StatusReportOrderedForOption,
    },
    stipulatedDecisionOrdered: { date: '', dueDate: '', note: '' },
  },
  petitionersSection: { noAppearance: false, petitioners: {} },
  respondentsSection: { respondents: {} },
  trialBriefSection: {
    briefDetails: {},
    briefType: '' as BriefTypeOption,
    dateBenchOpinionRendered: '',
    dateSubmitted: '',
    note: '',
    totalTrialHours: undefined,
    transcriptOrdered: false,
  },
  trialSessionMetadataSection: {
    courtReporter: '',
    judge: { fullName: '', title: '', userId: '' },
    remoteSession: false,
    trialClerk: '',
  },
  witnessesSection: {
    petitionerWitnesses: {},
    respondentWitnesses: {},
  },
};
