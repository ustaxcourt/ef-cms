import { applicationContext } from '../../test/createTestApplicationContext';
import { documentServiceEmail } from './documentServiceEmail';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';

describe('documentServiceEmail', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Document_Service_Email.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return documentServiceEmail({
        applicationContext,
        data: {
          caseDetail: {
            caseTitle: 'Test Case Title',
            docketNumber: '123-45',
            docketNumberWithSuffix: '123-45L',
          },
          currentDate: '2022-01-01',
          docketEntryNumber: 1,
          documentDetail: {
            documentTitle: 'Answer',
            eventCode: 'A',
            filedBy: 'Petr. Guy Fieri',
            servedAtFormatted: '02/03/2020 12:00am EST',
          },
          name: 'Guy Fieri',
          taxCourtLoginUrl: 'http://example.com/login',
        },
      });
    },
    testDescription: 'generates a DocumentServiceEmail document',
  });
});
