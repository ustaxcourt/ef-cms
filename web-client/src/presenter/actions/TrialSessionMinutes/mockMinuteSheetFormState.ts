export const mockMinuteSheetFormState = {
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
    irsPractitionerOptions: [],
  },
  ordersSection: {
    statusReportOrdered: { date: '', dueDate: '', note: '', orderedFor: '' },
    stipulatedDecisionOrdered: { date: '', dueDate: '', note: '' },
  },
  petitionersSection: { noAppearance: false, petitioners: {} },
  respondentsSection: { respondents: {} },
  trialBriefSection: {
    briefDetails: {},
    briefType: '',
    dateBenchOpinionRendered: '',
    dateSubmitted: '',
    note: '',
    totalTrialHours: undefined,
    transcriptOrdered: false,
  },
  trialSessionMetadataSection: {
    courtReporter: '',
    judge: { fullName: '', title: '', userId: '' },
    judgeOptions: {},
    remoteSession: false,
    trialClerk: '',
  },
  witnessesSection: {
    petitionerWitnesses: {},
    respondentWitnesses: {},
  },
};
