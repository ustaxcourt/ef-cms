const { applicationContext } = require('../test/createTestApplicationContext');

const fs = require('fs');
const path = require('path');
const {
  generatePdfFromHtmlInteractor,
} = require('../useCases/generatePdfFromHtmlInteractor');
const { getChromiumBrowser } = require('./getChromiumBrowser');

const {
  changeOfAddress,
  docketRecord,
  noticeOfDocketChange,
  standingPretrialOrder,
} = require('./documentGenerators');

describe('documentGenerators', () => {
  const testOutputPath = path.resolve(
    __dirname,
    '../../../test-output/document-generation',
  );

  const writePdfFile = (name, data) => {
    const path = `${testOutputPath}/${name}.pdf`;
    fs.writeFileSync(path, data);
  };

  beforeAll(() => {
    if (process.env.PDF_OUTPUT) {
      applicationContext.getChromiumBrowser.mockImplementation(
        getChromiumBrowser,
      );

      applicationContext.getNodeSass.mockImplementation(() => {
        // eslint-disable-next-line security/detect-non-literal-require
        return require('node-' + 'sass');
      });

      applicationContext.getPug.mockImplementation(() => {
        // eslint-disable-next-line security/detect-non-literal-require
        return require('p' + 'ug');
      });

      applicationContext
        .getUseCases()
        .generatePdfFromHtmlInteractor.mockImplementation(
          generatePdfFromHtmlInteractor,
        );
    }
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
        state: 'ST',
      };
      const pdf = await changeOfAddress({
        applicationContext,
        content: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          documentTitle: 'Notice of Change of Address',
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

  describe('docketRecord', () => {
    it('Generates a Printable Docket Record document', async () => {
      const pdf = await docketRecord({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseDetail: {
            contactPrimary: {
              address1: 'Address 1',
              address2: 'Address 2',
              address3: 'Address 3',
              city: 'City',
              country: 'USA',
              name: 'Test Petitioner',
              phone: '123-124-1234',
              postalCode: '12345',
              state: 'STATE',
            },
            irsPractitioners: [
              {
                barNumber: 'PT20002',
                contact: {
                  address1: 'Address 1',
                  address2: 'Address 2',
                  address3: 'Address 3',
                  city: 'City',
                  country: 'USA',
                  phone: '234-123-4567',
                  postalCode: '12345',
                  state: 'STATE',
                },
                name: 'Test IRS Practitioner',
              },
            ],
            partyType: 'Petitioner',
            privatePractitioners: [
              {
                barNumber: 'PT20001',
                contact: {
                  address1: 'Address 1',
                  address2: 'Address 2',
                  address3: 'Address 3',
                  city: 'City',
                  country: 'USA',
                  phone: '234-123-4567',
                  postalCode: '12345',
                  state: 'STATE',
                },
                formattedName: 'Test Private Practitioner (PT20001)',
                name: 'Test Private Practitioner',
              },
            ],
          },
          caseTitle: 'Test Petitioner',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          entries: [
            {
              document: {
                filedBy: 'Test Filer',
                isNotServedCourtIssuedDocument: false,
                isStatusServed: true,
                servedAtFormatted: '02/02/20',
                servedPartiesCode: 'B',
              },
              index: 1,
              record: {
                action: 'Axun',
                createdAtFormatted: '01/01/20',
                description: 'Test Description',
                eventCode: 'T',
                filingsAndProceedings: 'Test Filings And Proceedings',
              },
            },
          ],
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Docket_Record', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });

  describe('noticeOfDocketChange', () => {
    it('generates a Standing Pre-trial Order document', async () => {
      const pdf = await noticeOfDocketChange({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketEntryIndex: '1',
          docketNumberWithSuffix: '123-45S',
          filingsAndProceedings: {
            after: 'Filing and Proceedings After',
            before: 'Filing and Proceedings Before',
          },
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Notice_Of_Docket_Change', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });

  describe('standingPretrialOrder', () => {
    it('generates a Standing Pre-trial Order document', async () => {
      const pdf = await standingPretrialOrder({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          footerDate: '02/02/20',
          trialInfo: {
            city: 'Some City',
            fullStartDate: 'Friday May 8, 2020',
            judge: {
              name: 'Test Judge',
            },
            state: 'TEST STATE',
          },
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Standing_Pretrial_Order', pdf);
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
