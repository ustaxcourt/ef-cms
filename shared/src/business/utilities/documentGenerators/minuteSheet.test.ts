import { FormattedMinuteSheet } from '@web-api/business/useCaseHelper/trialSessionMinutes/formatMinuteSheet';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { minuteSheet } from './minuteSheet';

describe('minuteSheet', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Minute_Sheet.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return minuteSheet({
        applicationContext,
        data: { formattedMinuteSheet: testFormattedMinuteSheet },
      });
    },
    testDescription: 'generates a complete Minute Sheet document',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Minute_Sheet.pdf',
    pageNumber: 2,
    pdfGenerateFunction: () => {
      return minuteSheet({
        applicationContext,
        data: { formattedMinuteSheet: testFormattedMinuteSheet },
      });
    },
    testDescription: 'generates a complete Minute Sheet document',
  });
});

const testFormattedMinuteSheet: FormattedMinuteSheet = {
  actionsAndFilings: [
    {
      content: '01/15/2024; Motion to Dismiss - Filed by Petitioner; Granted',
    },
  ],
  called: '01/15/2024; Transcript ordered',
  caseTitle: 'John Smith',
  courtReporter: 'Jane Smith',
  docketNumbers: ['123-45S', '123-46S'],
  docketNumberWithSuffix: '123-45S',
  exhibits: [
    {
      description: 'Bank Statement 2023',
      note: 'Original documents',
      status: 'Admitted',
    },
  ],
  formattedDocketNumbers: '123-45S, 123-46S',
  judgeFullName: 'Judge John Doe',
  judgeTitle: 'Special Trial Judge',
  jurisdictionContinued: '02/15/2024; <em>Continued for tax computation</em>',
  jurisdictionRetained: '01/15/2024; <em>Retained for further proceedings</em>',
  motions: [
    {
      content:
        '01/15/2024; Motion to Dismiss; Filed by Petitioner; Granted; No objection',
      motionType: 'Motion to Dismiss',
    },
  ],
  notCalled: '',
  petitionerAppearances: ['John Smith (Petitioner) - Present all days'],
  petitionerWitnesses: [{ name: 'Alice Johnson' }],
  pretrialConference:
    '01/14/2024; <em>All parties present</em>; Transcript ordered',
  recalled: [
    {
      content: '01/16/2024; <em>For status update</em>; Transcript ordered',
    },
  ],
  remoteSession: 'Yes',
  respondentAppearances: ['Jane Doe - Present all days'],
  respondentWitnesses: [{ name: 'Bob Wilson' }],
  statusReportOrdered: '03/15/2024; Ordered for Both Parties; Due 04/15/2024',
  stipulatedDecisionOrdered:
    '01/15/2024; Due 02/15/2024; <em>Parties to submit by mail</em>',
  trialBrief: {
    benchOpinionRendered: '01/20/2024; Transcript ordered',
    briefDetails: ['Opening - Petitioner; Due 02/15/2024'],
    briefType: 'Simultaneous',
    dateSubmitted: '01/15/2024',
    totalTrialHours: '4',
  },
  trialClerk: 'Mary Johnson',
  trialHearing:
    '01/15/2024; Trial Session; <em>Full day hearing</em>; Transcript ordered',
  trialLocation: 'Washington, D.C.',
  trialStartDate: '01/15/2024',
};
