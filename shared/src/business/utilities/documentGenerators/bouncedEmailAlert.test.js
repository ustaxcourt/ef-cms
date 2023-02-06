const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { bouncedEmailAlert } = require('./bouncedEmailAlert');
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';

describe('bouncedEmailAlert', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Bounced_Email_Alert.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return bouncedEmailAlert({
        applicationContext,
        data: {
          bounceRecipient: 'someone@example.com',
          bounceSubType: 'Permanent',
          bounceType: 'OnSuppressionList',
          currentDate: '2022-01-01',
          environmentName: 'local',
          errorMessage: 'Message Undeliverable',
          subject: 'We are attempting to serve you',
        },
      });
    },
    testDescription: 'generates a Bounced Email Alert document',
  });
});
