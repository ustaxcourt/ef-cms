import {
  PreviousTerm,
  TrialLocationData,
} from '@shared/business/utilities/trialSessionPlanningReport/trialSessionPlanningReportDataTypes';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { trialSessionPlanningReport } from './trialSessionPlanningReport';

describe('trialSessionPlanningReport', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Trial_Session_Planning_Report.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      trialSessionPlanningReport({
        applicationContext,
        data: {
          locationData: [
            {
              allCaseCount: 5,
              blockedCaseCount: 0,
              previousTermsData: [['(S) Buch', '(R) Cohen'], [], []],
              regularCaseCount: 3,
              smallCaseCount: 2,
              specialCaseCount: 0,
              stateAbbreviation: 'AR',
              trialCityState: 'Little Rock, AR',
            },
            {
              allCaseCount: 2,
              blockedCaseCount: 0,
              previousTermsData: [[], ['(HS) Colvin'], ['(H) Guy']],
              regularCaseCount: 1,
              smallCaseCount: 1,
              specialCaseCount: 0,
              stateAbbreviation: 'AL',
              trialCityState: 'Mobile, AL',
            },
          ] as TrialLocationData[],
          previousTerms: [
            {
              term: 'fall',
              termDisplay: 'Fall 2019',
              year: '2019',
            },
            {
              term: 'spring',
              termDisplay: 'Spring 2019',
              year: '2019',
            },
            {
              term: 'winter',
              termDisplay: 'Winter 2019',
              year: '2019',
            },
          ] as PreviousTerm[],
          term: 'Winter 2020',
        },
      }),
    testDescription: 'generates a Trial Session Planning Report document',
  });
});
