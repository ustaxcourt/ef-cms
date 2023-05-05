import { addressLabelCoverSheet } from './addressLabelCoverSheet';
import { applicationContext } from '../../test/createTestApplicationContext';
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
          address2: 'Apt. 1B',
          city: 'Some City',
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
