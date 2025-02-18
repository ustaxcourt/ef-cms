import { FormattedMinuteSheet } from './formatMinuteSheet';

export const mockFormattedMinuteSheet: FormattedMinuteSheet = {
  actionsAndFilings: [{ content: 'Action 1 content' }],
  called: '01/01/2024; Test note',
  courtReporter: 'Jane Smith',
  docketNumberWithSuffix: '123-45',
  docketNumbers: ['123-45', '123-46'],
  exhibits: [
    {
      description: 'Exhibit A',
      status: 'Admitted',
      note: 'Test note',
    },
  ],
  formattedDocketNumbers: '123-45, 123-46',
  judgeFullName: 'Judge John Doe',
  judgeTitle: 'Judge',
  jurisdictionContinued: '01/15/2024; Continued note',
  jurisdictionRetained: '01/10/2024; Retained note',
  motions: [
    {
      motionType: 'Motion to Dismiss',
      content: 'Motion content',
    },
  ],
  notCalled: '01/02/2024; Not called note',
  petitionerAppearances: ['John Petitioner - 01/01/2024'],
  petitionerWitnesses: [{ name: 'Witness One' }],
  petitioners: 'John Petitioner',
  pretrialConference: '01/03/2024; Pretrial note',
  recalled: [{ content: 'Recall 1 content' }],
  remoteSession: 'Yes',
  respondentAppearances: ['Jane Respondent - 01/01/2024'],
  respondentWitnesses: [{ name: 'Witness Two' }],
  statusReportOrdered: '01/05/2024; Due 01/20/2024',
  stipulatedDecisionOrdered: '01/06/2024; Due 01/21/2024',
  trialBrief: {
    dateSubmitted: '01/07/2024',
    benchOpinionRendered: '01/08/2024',
    totalTrialHours: '4',
    briefType: 'Regular',
    briefDetails: ['Opening brief - Petitioner; Due 01/15/2024'],
  },
  trialClerk: 'Mary Clerk',
  trialHearing: '01/09/2024; Trial note',
  trialLocation: 'Washington, D.C.',
  trialStartDate: 'January 1, 2024',
};
