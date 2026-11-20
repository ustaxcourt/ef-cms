import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { noticeOfAssignmentOfJudge } from '@web-api/business/utilities/documentGenerators/noticeOfAssignmentOfJudge';

describe('noticeOfAssignmentOfJudge', () => {
  const data = {
    caseCaptionExtension: 'Petitioner',
    caseTitle: 'Test Petitioner',
    docketNumberWithSuffix: '123-45',
    judgeTitleWithFullName: 'Judge Test T. Judge',
    nameOfClerk: 'Test Clerk',
    titleOfClerk: 'Clerk of the Court',
  };

  generateAndVerifyPdfDiff({
    fileName: 'Notice_Of_Assignment_Of_Judge.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      noticeOfAssignmentOfJudge({
        applicationContext,
        data: {
          ...data,
          chambersPhoneNumber: '(202) 521-0810',
        },
      }),
    testDescription:
      'generates a Notice of Assignment of Judge document with a chambers phone number',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Notice_Of_Assignment_Of_Judge_No_Chambers_Phone.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      noticeOfAssignmentOfJudge({
        applicationContext,
        data,
      }),
    testDescription:
      'generates a Notice of Assignment of Judge document without a chambers phone number',
  });
});
