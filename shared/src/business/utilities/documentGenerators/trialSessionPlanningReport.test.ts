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
              previousTermsData: [['(S) Buch', '(R) Cohen'], [], []],
              regularCaseCount: 3,
              smallCaseCount: 2,
              stateAbbreviation: 'AR',
              trialCityState: 'Little Rock, AR',
            },
            {
              allCaseCount: 2,
              previousTermsData: [[], ['(HS) Colvin'], ['(H) Guy']],
              regularCaseCount: 1,
              smallCaseCount: 1,
              stateAbbreviation: 'AL',
              trialCityState: 'Mobile, AL',
            },
          ],
          previousTerms: [
            {
              name: 'fall',
              termDisplay: 'Fall 2019',
              year: '2019',
            },
            {
              name: 'spring',
              termDisplay: 'Spring 2019',
              year: '2019',
            },
            {
              name: 'winter',
              termDisplay: 'Winter 2019',
              year: '2019',
            },
          ],
          term: 'Winter 2020',
        },
      }),
    testDescription: 'generates a Trial Session Planning Report document',
  });
});
