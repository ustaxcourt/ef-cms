const { applicationContext } = require('../test/createTestApplicationContext');

const fs = require('fs');
const path = require('path');
const {
  generatePdfFromHtmlInteractor,
} = require('../useCases/generatePdfFromHtmlInteractor');
const { getChromiumBrowser } = require('./getChromiumBrowser');

const {
  caseInventoryReport,
  changeOfAddress,
  docketRecord,
  noticeOfDocketChange,
  pendingReport,
  receiptOfFiling,
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
  describe('caseInventoryReport', () => {
    it('generates a Case Inventory Report document', async () => {
      const pdf = await caseInventoryReport({
        applicationContext,
        data: {
          formattedCases: [
            {
              associatedJudge: 'Judge Armen',
              caseTitle: 'rick james b',
              docketNumber: '101-20',
              docketNumberSuffix: 'L',
              status: 'Closed',
            },
          ],
          reportTitle: 'General Docket - Not at Issue',
          showJudgeColumn: true,
          showStatusColumn: true,
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Case_Inventory_Report', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
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

  describe('pendingReport', () => {
    it('generates a Pending Report document', async () => {
      const pdf = await pendingReport({
        applicationContext,
        data: {
          pendingItems: [
            {
              caseTitle: 'Test Petitioner',
              dateFiled: '02/02/20',
              docketNumberWithSuffix: '123-45S',
              filingsAndProceedings: 'Order',
              judge: 'Chief Judge',
              status: 'closed',
            },
            {
              caseTitle: 'Test Petitioner',
              dateFiled: '02/22/20',
              docketNumberWithSuffix: '123-45S',
              filingsAndProceedings: 'Motion for a New Trial',
              judge: 'Chief Judge',
              status: 'closed',
            },
            {
              caseTitle: 'Other Petitioner',
              dateFiled: '03/03/20',
              docketNumberWithSuffix: '321-45S',
              filingsAndProceedings: 'Order',
              judge: 'Chief Judge',
              status: 'closed',
            },
            {
              caseTitle: 'Other Petitioner',
              dateFiled: '03/23/20',
              docketNumberWithSuffix: '321-45S',
              filingsAndProceedings: 'Order to Show Cause',
              judge: 'Chief Judge',
              status: 'closed',
            },
          ],
          subtitle: 'Chief Judge',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Pending_Report', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });

  describe('receiptOfFiling', () => {
    it('generates a Receipt of Filing document', async () => {
      const pdf = await receiptOfFiling({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          document: {
            attachments: true,
            certificateOfService: true,
            certificateOfServiceDate: '02/22/20',
            documentTitle: 'Primary Document Title',
            objections: 'No',
          },
          filedAt: '02/22/20 2:22am ET',
          filedBy: 'Mike Wazowski',
          secondaryDocument: {
            attachments: false,
            certificateOfService: true,
            certificateOfServiceDate: '02/22/20',
            documentTitle: 'Secondary Document Title',
            objections: 'No',
          },
          secondarySupportingDocuments: [
            {
              attachments: true,
              certificateOfService: false,
              certificateOfServiceDate: null,
              documentTitle: 'Secondary Supporting Document One Title',
              objections: 'No',
            },
            {
              attachments: false,
              certificateOfService: false,
              certificateOfServiceDate: null,
              documentTitle: 'Secondary Supporting Document Two Title',
              objections: 'Unknown',
            },
          ],
          supportingDocuments: [
            {
              attachments: false,
              certificateOfService: false,
              certificateOfServiceDate: null,
              documentTitle: 'Supporting Document One Title',
              objections: null,
            },
            {
              attachments: false,
              certificateOfService: true,
              certificateOfServiceDate: '02/02/20',
              documentTitle: 'Supporting Document Two Title',
              objections: 'No',
            },
          ],
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Receipt_of_Filing', pdf);
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
