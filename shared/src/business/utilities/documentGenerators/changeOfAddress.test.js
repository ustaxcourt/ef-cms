const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const {
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP,
} = require('../../entities/EntityConstants');
const { changeOfAddress, computeChangeOptions } = require('./changeOfAddress');
const { getChromiumBrowser } = require('../getChromiumBrowser');

describe('documentGenerators', () => {
  const testOutputPath = path.resolve(
    __dirname,
    '../../../../test-output/document-generation',
  );

  const writePdfFile = (name, data) => {
    const pdfPath = `${testOutputPath}/${name}.pdf`;
    fs.writeFileSync(pdfPath, data);
  };

  beforeAll(() => {
    if (process.env.PDF_OUTPUT) {
      fs.mkdirSync(testOutputPath, { recursive: true }, err => {
        if (err) throw err;
      });

      applicationContext.getChromiumBrowser.mockImplementation(
        getChromiumBrowser,
      );

      applicationContext
        .getUseCases()
        .generatePdfFromHtmlInteractor.mockImplementation(
          generatePdfFromHtmlInteractor,
        );
    }
  });

  describe('compute display options', () => {
    const displayOptions = {
      NCA: {
        h3: 'Notice of Change of Address',
        isAddressAndPhoneChange: false,
        isAddressChange: true,
        isEmailChange: false,
        isPhoneChangeOnly: false,
      },
      NCAP: {
        h3: 'Notice of Change of Address and Telephone Number',
        isAddressAndPhoneChange: true,
        isAddressChange: true,
        isEmailChange: false,
        isPhoneChangeOnly: false,
      },
      NCP: {
        h3: 'Notice of Change of Telephone Number',
        isAddressAndPhoneChange: false,
        isAddressChange: false,
        isEmailChange: false,
        isPhoneChangeOnly: true,
      },
      NOCE: {
        h3: 'Notice of Change of Email Address',
        isAddressAndPhoneChange: false,
        isAddressChange: false,
        isEmailChange: true,
        isPhoneChangeOnly: false,
      },
    };

    NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP.forEach(documentType =>
      it(`computes options based on document type with event code ${documentType.eventCode}`, () => {
        const result = computeChangeOptions({ documentType });
        console.log('result', result);
        expect(result).toEqual(displayOptions[documentType.eventCode]);
      }),
    );
  });

  describe('changeOfAddress', () => {
    it('Generates a Change of Address document', async () => {
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
      const pdf = await changeOfAddress({
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

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Change_Of_Address', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });
});
