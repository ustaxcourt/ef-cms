import { applicationContext } from '../../test/createTestApplicationContext';
import { entryOfAppearance } from './entryOfAppearance';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';

describe('entryOfAppearance', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Entry_of_Appearance.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return entryOfAppearance({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner',
          caseTitle: 'Bootsy Collins',
          docketNumberWithSuffix: '101-24S',
          filers: ['Bootsy Collins', 'George Clinton', 'Fuzzy Haskins'],
          practitionerInformation: {
            barNumber: 'PT1234',
            contact: {
              address1: '234 Main St',
              address2: 'Apartment 4',
              address3: 'Under the stairs',
              city: 'Chicago',
              countryType: 'domestic',
              phone: '+1 (555) 555-5555',
              postalCode: '61234',
              state: 'IL',
            },
            email: 'privatePractitioner@example.com',
            entityName: 'Practitioner',
            firmName: 'GW Law Offices',
            originalBarState: 'MD',
            userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
          },
        },
      });
    },
    testDescription: 'generates a Entry of Appearance document',
  });
});
