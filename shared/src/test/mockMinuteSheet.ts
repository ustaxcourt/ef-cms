import { MinuteSheet } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

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
