import { NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { changeOfAddress, computeChangeOptions } from './changeOfAddress';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';

describe('changeOfAddress', () => {
  describe('compute display options', () => {
    const displayOptions = {
      NCA: {
        h3: NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP.find(
          ({ eventCode }) => eventCode === 'NCA',
        ).title,
        isAddressAndPhoneChange: false,
        isAddressChange: true,
        isEmailChange: false,
        isPhoneChangeOnly: false,
      },
      NCAP: {
        h3: NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP.find(
          ({ eventCode }) => eventCode === 'NCAP',
        ).title,
        isAddressAndPhoneChange: true,
        isAddressChange: true,
        isEmailChange: false,
        isPhoneChangeOnly: false,
      },
      NCP: {
        h3: NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP.find(
          ({ eventCode }) => eventCode === 'NCP',
        ).title,
        isAddressAndPhoneChange: false,
        isAddressChange: false,
        isEmailChange: false,
        isPhoneChangeOnly: true,
      },
      NOCE: {
        h3: NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP.find(
          ({ eventCode }) => eventCode === 'NOCE',
        ).title,
        isAddressAndPhoneChange: false,
        isAddressChange: false,
        isEmailChange: true,
        isPhoneChangeOnly: false,
      },
    };

    Object.keys(displayOptions).forEach(eventCode =>
      it(`computes options based on document type with event code ${eventCode}`, () => {
        const result = computeChangeOptions({
          documentType: { eventCode, title: displayOptions[eventCode].h3 },
        });
        expect(result).toEqual(displayOptions[eventCode]);
      }),
    );
  });

  describe('Generate pdf', () => {
    const contactInfo = {
      address1: 'Address 1',
      address2: 'Address 2',
      address3: 'Address 3',
      city: 'City',
      country: 'USA',
      inCareOf: 'Test Care Of',
      phone: '123-124-1234',
      postalCode: '12345',
      state: 'AL',
    };

    generateAndVerifyPdfDiff({
      fileName: 'Change_Of_Address.pdf',
      pageNumber: 1,
      pdfGenerateFunction: () => {
        return changeOfAddress({
          applicationContext,
          content: {
            caseCaptionExtension: 'Petitioner(s)',
            caseTitle: 'Test Petitioner',
            docketNumber: '123-45',
            docketNumberWithSuffix: '123-45S',
            documentType: {
              eventCode: 'NCA',
              title: 'Notice of Change of Address',
            },
            name: 'Test Person',
            newData: {
              ...contactInfo,
              address1: 'Address One',
            },
            oldData: contactInfo,
          },
        });
      },
      testDescription: 'Generates a Change of Address document',
    });
  });
});
