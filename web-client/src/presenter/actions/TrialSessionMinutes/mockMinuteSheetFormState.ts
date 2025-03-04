import {
  BriefTypeOption,
  StatusReportOrderedForOption,
} from '@shared/business/entities/EntityConstants';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';

export const mockMinuteSheetFormState: MinuteSheetFormState = {
  actionsAndFilingsSection: { actionsAndFilings: {} },
  caseMetadataSection: {
    called: { date: '', note: '', transcriptOrdered: false },
    notCalled: { date: '', note: '' },
    pretrialConference: { date: '', note: '', transcriptOrdered: false },
    recalled: {
      '0': { date: '', note: '', transcriptOrdered: false, renderKey: '0' },
    },
    trialHearing: {
      date: '',
      note: '',
      transcriptOrdered: false,
      trialHearingType: '',
    },
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
