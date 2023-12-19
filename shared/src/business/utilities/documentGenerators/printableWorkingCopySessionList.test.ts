import {
  FORMATTED_CASES,
  FORMATTED_TRIAL_SESSION,
  SESSION_NOTES,
} from './constants/printableTrialSessionWorkingCopyConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { printableWorkingCopySessionList } from './printableWorkingCopySessionList';

describe('printableWorkingCopySessionList', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Printable_Trial_Session_Working_Copy_With_Case_Notes.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      printableWorkingCopySessionList({
        applicationContext,
        data: {
          filters: [
            { key: 'setForTrial', label: 'Set For Trial' },
            { key: 'dismissed', label: 'Dismissed' },
            { key: 'continued', label: 'Continued' },
            { key: 'rule122', label: 'Rule 122' },
            { key: 'basisReached', label: 'Basis Reached' },
            { key: 'settled', label: 'Settled' },
            { key: 'recall', label: 'Recall' },
            { key: 'submittedCAV', label: 'Submitted/CAV' },
            { key: 'statusUnassigned', label: 'Unassigned' },
          ],
          formattedCases: FORMATTED_CASES,
          formattedTrialSession: FORMATTED_TRIAL_SESSION,
          sessionNotes: SESSION_NOTES,
          showCaseNotes: true,
          sort: 'docket',
          userHeading: 'Gustafson - Session Copy',
        },
      }),
    testDescription:
      'generates a Trial Session Working Copy document with case notes page 1',
  });

  generateAndVerifyPdfDiff({
    fileName:
      'Printable_Trial_Session_Working_Copy_With_Case_Notes_Using_New_Calendar_Props.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      printableWorkingCopySessionList({
        applicationContext,
        data: {
          filters: [
            { key: 'setForTrial', label: 'Set For Trial' },
            { key: 'dismissed', label: 'Dismissed' },
            { key: 'continued', label: 'Continued' },
            { key: 'rule122', label: 'Rule 122' },
            { key: 'basisReached', label: 'Basis Reached' },
            { key: 'settled', label: 'Settled' },
            { key: 'recall', label: 'Recall' },
            { key: 'submittedCAV', label: 'Submitted/CAV' },
            { key: 'statusUnassigned', label: 'Unassigned' },
          ],
          formattedCases: FORMATTED_CASES,
          formattedTrialSession: {
            ...FORMATTED_TRIAL_SESSION,
            formattedIrsCalendarAdministratorInfo: {
              email: 'test@test.com',
              name: 'John Doe',
              phone: '+1 (555) 123-4567',
            },
          },
          sessionNotes: SESSION_NOTES,
          showCaseNotes: true,
          sort: 'docket',
          userHeading: 'Gustafson - Session Copy',
        },
      }),
    testDescription:
      'generates a Trial Session Working Copy document with case notes page 1 using new IRS calendar admin info',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Printable_Trial_Session_Working_Copy_With_Case_Notes.pdf',
    pageNumber: 2,
    pdfGenerateFunction: () =>
      printableWorkingCopySessionList({
        applicationContext,
        data: {
          filters: [
            { key: 'setForTrial', label: 'Set For Trial' },
            { key: 'dismissed', label: 'Dismissed' },
            { key: 'continued', label: 'Continued' },
            { key: 'rule122', label: 'Rule 122' },
            { key: 'basisReached', label: 'Basis Reached' },
            { key: 'settled', label: 'Settled' },
            { key: 'recall', label: 'Recall' },
            { key: 'submittedCAV', label: 'Submitted/CAV' },
            { key: 'statusUnassigned', label: 'Unassigned' },
          ],
          formattedCases: FORMATTED_CASES,
          formattedTrialSession: FORMATTED_TRIAL_SESSION,
          sessionNotes: SESSION_NOTES,
          showCaseNotes: true,
          sort: 'docket',
          userHeading: 'Gustafson - Session Copy',
        },
      }),
    testDescription:
      'generates a Trial Session Working Copy document with case notes page 2',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Printable_Trial_Session_Working_Copy_Without_Case_Notes.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      printableWorkingCopySessionList({
        applicationContext,
        data: {
          filters: [
            { key: 'setForTrial', label: 'Set For Trial' },
            { key: 'dismissed', label: 'Dismissed' },
            { key: 'continued', label: 'Continued' },
            { key: 'basisReached', label: 'Basis Reached' },
            { key: 'settled', label: 'Settled' },
            { key: 'recall', label: 'Recall' },
            { key: 'statusUnassigned', label: 'Unassigned' },
          ],
          formattedCases: FORMATTED_CASES,
          formattedTrialSession: FORMATTED_TRIAL_SESSION,
          sessionNotes: SESSION_NOTES,
          showCaseNotes: false,
          sort: 'docket',
          userHeading: 'Gustafson - Session Copy',
        },
      }),
    testDescription:
      'generates a Trial Session Working Copy document without case notes',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Printable_Trial_Session_Working_Copy_Without_Case_Notes.pdf',
    pageNumber: 2,
    pdfGenerateFunction: () =>
      printableWorkingCopySessionList({
        applicationContext,
        data: {
          filters: [
            { key: 'setForTrial', label: 'Set For Trial' },
            { key: 'dismissed', label: 'Dismissed' },
            { key: 'continued', label: 'Continued' },
            { key: 'basisReached', label: 'Basis Reached' },
            { key: 'settled', label: 'Settled' },
            { key: 'recall', label: 'Recall' },
            { key: 'statusUnassigned', label: 'Unassigned' },
          ],
          formattedCases: FORMATTED_CASES,
          formattedTrialSession: FORMATTED_TRIAL_SESSION,
          sessionNotes: SESSION_NOTES,
          showCaseNotes: false,
          sort: 'docket',
          userHeading: 'Gustafson - Session Copy',
        },
      }),
    testDescription:
      'generates a Trial Session Working Copy document without case notes page 2',
  });
});
