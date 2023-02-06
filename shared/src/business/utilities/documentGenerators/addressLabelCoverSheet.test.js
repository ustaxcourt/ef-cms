const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { addressLabelCoverSheet } = require('./addressLabelCoverSheet');
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';

describe('addressLabelCoverSheet', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Address_Label_Cover_Sheet.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return addressLabelCoverSheet({
        applicationContext,
        data: {
          address1: '123 Some Street',
          city: 'Some City',
          country: 'USA',
          docketNumberWithSuffix: '123-45S',
          name: 'Test Person',
          postalCode: '89890',
          state: 'ZZ',
        },
      });
    },
    testDescription:
      'generates an Address Label Cover Sheet document with a country included',
  });
});
