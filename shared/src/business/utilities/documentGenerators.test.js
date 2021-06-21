jest.mock('./combineTwoPdfs');
const fs = require('fs');
const path = require('path');
const sass = require('sass');
const {
  addressLabelCoverSheet,
  caseInventoryReport,
  changeOfAddress,
  coverSheet,
  docketRecord,
  noticeOfDocketChange,
  noticeOfReceiptOfPetition,
  noticeOfTrialIssued,
  order,
  pendingReport,
  practitionerCaseList,
  receiptOfFiling,
  standingPretrialOrder,
  standingPretrialOrderForSmallCase,
  trialCalendar,
  trialSessionPlanningReport,
} = require('./documentGenerators');
const {
  applicationContext,
  testPdfDoc,
} = require('../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  DOCKET_NUMBER_SUFFIXES,
  OBJECTIONS_OPTIONS_MAP,
  PARTY_TYPES,
  SERVED_PARTIES_CODES,
} = require('../entities/EntityConstants');
const {
  generatePdfFromHtmlInteractor,
} = require('../useCases/generatePdfFromHtmlInteractor');
const { combineTwoPdfs } = require('./combineTwoPdfs');
const { getChromiumBrowser } = require('./getChromiumBrowser');

describe('documentGenerators', () => {
  const testOutputPath = path.resolve(
    __dirname,
    '../../../test-output/document-generation',
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

      applicationContext.getNodeSass.mockImplementation(() => {
        return sass;
      });

      applicationContext.getPug.mockImplementation(() => {
        return require('pug');
      });

      applicationContext
        .getUseCases()
        .generatePdfFromHtmlInteractor.mockImplementation(
          generatePdfFromHtmlInteractor,
        );
    }

    combineTwoPdfs.mockReturnValue(testPdfDoc);
  });

  describe('addressLabelCoverSheet', () => {
    it('generates an Address Lable Cover Sheet document', async () => {
      const pdf = await addressLabelCoverSheet({
        applicationContext,
        data: {
          address1: '123 Some Street',
          city: 'Some City',
          countryName: 'USA',
          docketNumberWithSuffix: '123-45S',
          name: 'Test Person',
          postalCode: '89890',
          state: 'ZZ',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Address_Label_Cover_Sheet', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });

  describe('caseInventoryReport', () => {
    it('generates a Case Inventory Report document', async () => {
      const pdf = await caseInventoryReport({
        applicationContext,
        data: {
          formattedCases: [
            {
              associatedJudge: 'Judge Colvin',
              caseTitle: 'rick james b',
              docketNumber: '101-20',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
              status: CASE_STATUS_TYPES.closed,
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
        state: 'AL',
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

  describe('coverSheet', () => {
    it('Generates a CoverSheet document', async () => {
      const pdf = await coverSheet({
        applicationContext,
        data: {
          caseCaptionExtension: PARTY_TYPES.petitioner,
          caseTitle: 'Test Person',
          certificateOfService: true,
          dateFiledLodged: '01/01/20',
          dateFiledLodgedLabel: 'Filed',
          dateReceived: '01/02/20',
          dateServed: '01/03/20',
          docketNumberWithSuffix: '123-45S',
          documentTitle: 'Petition',
          electronicallyFiled: true,
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('CoverSheet', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });

    it('Generates a CoverSheet document for court issued documents that require a coversheet', async () => {
      const pdf = await coverSheet({
        applicationContext,
        data: {
          caseCaptionExtension: PARTY_TYPES.petitioner,
          caseTitle: 'Test Person',
          dateFiledLodged: '01/01/20',
          dateFiledLodgedLabel: 'Filed',
          docketNumberWithSuffix: '123-45S',
          documentTitle: 'Petition',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('CourtIssuedDocumentCoverSheet', pdf);
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
                  state: 'AL',
                },
                name: 'Test IRS Practitioner',
              },
            ],
            partyType: PARTY_TYPES.petitioner,
            petitioners: [
              {
                address1: 'Address 1',
                address2: 'Address 2',
                address3: 'Address 3',
                city: 'City',
                contactId: '65c932cc-8ada-4c2c-9a8c-7314b05fd0c0',
                counselDetails: [{ name: 'Test Private Practitioner' }],
                country: 'USA',
                name: 'Test Petitioner',
                phone: '123-124-1234',
                postalCode: '12345',
                state: 'AL',
              },
            ],
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
                  state: 'AL',
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
              action: 'Axun',
              createdAtFormatted: '01/01/20',
              description: 'Test Description',
              eventCode: 'T',
              filedBy: 'Test Filer',
              filingsAndProceedings: 'Test Filings And Proceedings',
              index: 1,
              isNotServedDocument: false,
              isStatusServed: true,
              servedAtFormatted: '02/02/20',
              servedPartiesCode: SERVED_PARTIES_CODES.BOTH,
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
    it('generates a Notice of Docket Change document', async () => {
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

  describe('noticeOfReceiptOfPetition', () => {
    it('generates a Notice of Receipt of Petition document', async () => {
      const pdf = await noticeOfReceiptOfPetition({
        applicationContext,
        data: {
          address: {
            address1: '123 Some St.',
            city: 'Somecity',
            countryName: '',
            name: 'Test Petitioner',
            postalCode: '80008',
            state: 'ZZ',
          },
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          preferredTrialCity: 'Birmingham, Alabama',
          receivedAtFormatted: 'December 1, 2019',
          servedDate: 'June 3, 2020',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Notice_Receipt_Petition', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });

  describe('noticeOfTrialIssued', () => {
    it('generates a Notice of Trial Issued document', async () => {
      const pdf = await noticeOfTrialIssued({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle:
            'Milton Schwartz, Deceased, Neil Schwartz, Fiduciary and Ada Schwartz, Deceased, Neil Schwartz, Fiduciary, Petitioners',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            formattedJudge: 'Chief Special Trial Judge Carluzzo',
            formattedStartDate: '01/01/2001',
            formattedStartTime: '12:00 am',
            joinPhoneNumber: '444-444-4444',
            meetingId: 'sdsd',
            password: '123',
            trialLocation: 'Birmingham, Alabama',
          },
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Notice_Trial_Issued', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
        const { PDFDocument } = await applicationContext.getPdfLib();
        const pdfDoc = await PDFDocument.load(new Uint8Array(pdf));
        expect(pdfDoc.getPages().length).toEqual(1);
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });

  describe('standingPretrialOrderForSmallCase', () => {
    it('generates a Standing Pre-trial Order for Small Case document', async () => {
      const pdf = await standingPretrialOrderForSmallCase({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle:
            'Test Petitioner, Another Petitioner, and Yet Another Petitioner',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            address1: '123 Some St.',
            address2: '3rd Floor',
            address3: 'Suite B',
            city: 'Some City',
            courthouseName: 'Hall of Justice',
            fullStartDate: 'Friday May 8, 2020',
            judge: {
              name: 'Test Judge',
            },
            postalCode: '12345',
            startDay: 'Friday',
            startTime: '10:00am',
            state: 'AL',
          },
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Standing_Pretrial_Notice', pdf);
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
          trialInfo: {
            city: 'Some City',
            fullStartDate: 'Friday May 8, 2020',
            judge: {
              name: 'Test Judge',
            },
            state: 'AL',
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

  describe('notice', () => {
    it('generates a Notice document', async () => {
      const pdf = await order({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          orderContent: `<p>This is some sample notice text.</p>

          <p>NOTICE that the joint motion for continuance is granted in that thesecases are stricken for trial from the Court's January 27, 2020, Los Angeles, California, trial session. It is further</p>

          <p>NOTICE that the joint motion to remand to respondent's Appeals Office is granted and these cases are
          remanded to respondent's Appeals Office for a supplemental collection due process hearing. It is further</p>`,
          orderTitle: 'NOTICE',
          signatureText: 'Test Signature',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Notice', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });

  describe('order', () => {
    it('generates an Order document', async () => {
      const pdf = await order({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          orderContent: `<p>Upon due consideration ofthe parties' joint motion to remand, filed December 30, 2019, and the parties' joint motion for continuance, filed December 30, 2019, it is</p>

          <p>ORDERED that the joint motion for continuance is granted in that thesecases are stricken for trial from the Court's January 27, 2020, Los Angeles, California, trial session. It is further</p>

          <p>ORDERED that the joint motion to remand to respondent's Appeals Office is granted and these cases are
          remanded to respondent's Appeals Office for a supplemental collection due process hearing. It is further</p>

          <p>ORDERED that respondent shall offer petitioners an administrative hearing at respondent's Appeals Office
          located closest to petitioners' residence (or at such other place as may be mutually agreed upon) at a
          reasonable and mutually agreed upon date and time, but no later than April 1, 2020. It is further</p>

          <p>ORDERED that each party shall, on or before April 15, 2020, file with the Court, and serve on the other party, a report regarding the then present status of these cases. It is further</p>

          <p>ORDERED that the joint motion to remand to respondent's Appeals Office is granted and these cases are
          remanded to respondent's Appeals Office for a supplemental collection due process hearing. It is further</p>

          <p>ORDERED that respondent shall offer petitioners an administrative hearing at respondent's Appeals Office
          located closest to petitioners' residence (or at such other place as may be mutually agreed upon) at a
          reasonable and mutually agreed upon date and time, but no later than April 1, 2020. It is further</p>

          <p>ORDERED that each party shall, on or before April 15, 2020, file with the Court, and serve on the other party, a report regarding the then present status of these cases. It is further</p>

          <p>ORDERED that the joint motion for continuance is granted in that thesecases are stricken for trial from the Court's January 27, 2020, Los Angeles, California, trial session. It is further</p>

          <p>ORDERED that the joint motion to remand to respondent's Appeals Office is granted and these cases are
          remanded to respondent's Appeals Office for a supplemental collection due process hearing. It is further</p>

          <p>ORDERED that respondent shall offer petitioners an administrative hearing at respondent's Appeals Office
          located closest to petitioners' residence (or at such other place as may be mutually agreed upon) at a
          reasonable and mutually agreed upon date and time, but no later than April 1, 2020. It is further</p>

          <p>ORDERED that each party shall, on or before April 15, 2020, file with the Court, and serve on the other party, a report regarding the then present status of these cases. It is further</p>

          <p>ORDERED that the joint motion to remand to respondent's Appeals Office is granted and these cases are
          remanded to respondent's Appeals Office for a supplemental collection due process hearing. It is further</p>

          <p>ORDERED that respondent shall offer petitioners an administrative hearing at respondent's Appeals Office
          located closest to petitioners' residence (or at such other place as may be mutually agreed upon) at a
          reasonable and mutually agreed upon date and time, but no later than April 1, 2020. It is further</p>

          <p>ORDERED that each party shall, on or before April 15, 2020, file with the Court, and serve on the other party, a report regarding the then present status of these cases. It is further</p>`,
          orderTitle: 'ORDER',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Order', pdf);
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
              associatedJudgeFormatted: CHIEF_JUDGE,
              caseTitle: 'Test Petitioner',
              docketNumberWithSuffix: '123-45S',
              formattedFiledDate: '02/02/20',
              formattedName: 'Order',
              status: 'closed',
            },
            {
              associatedJudgeFormatted: CHIEF_JUDGE,
              caseTitle: 'Test Petitioner',
              docketNumberWithSuffix: '123-45S',
              formattedFiledDate: '02/22/20',
              formattedName: 'Motion for a New Trial',
              status: 'closed',
            },
            {
              associatedJudgeFormatted: CHIEF_JUDGE,
              caseTitle: 'Other Petitioner',
              docketNumberWithSuffix: '321-45S',
              formattedFiledDate: '03/03/20',
              formattedName: 'Order',
              status: 'closed',
            },
            {
              associatedJudgeFormatted: CHIEF_JUDGE,
              caseTitle: 'Other Petitioner',
              docketNumberWithSuffix: '321-45S',
              formattedFiledDate: '03/23/20',
              formattedName: 'Order to Show Cause',
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

  describe('practitionerCaseList', () => {
    it('generates a Pending Report document', async () => {
      const pdf = await practitionerCaseList({
        applicationContext,
        data: {
          barNumber: 'PT1234',
          closedCases: [
            {
              caseTitle: 'Test Closed Case 1',
              docketNumberWithSuffix: '123-45S',
              status: CASE_STATUS_TYPES.closed,
            },
            {
              caseTitle: 'Test Closed Case 2',
              docketNumberWithSuffix: '223-45S',
              status: CASE_STATUS_TYPES.closed,
            },
          ],
          openCases: [
            {
              caseTitle: 'Test Open Case 1',
              docketNumberWithSuffix: '323-45S',
              status: CASE_STATUS_TYPES.generalDocket,
            },
          ],
          practitionerName: 'Ben Matlock',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Practitioner_Case_List', pdf);
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
            objections: OBJECTIONS_OPTIONS_MAP.NO,
          },
          filedAt: '02/22/20 2:22am ET',
          filedBy: 'Mike Wazowski',
          secondaryDocument: {
            attachments: false,
            certificateOfService: true,
            certificateOfServiceDate: '02/22/20',
            documentTitle: 'Secondary Document Title',
            objections: OBJECTIONS_OPTIONS_MAP.NO,
          },
          secondarySupportingDocuments: [
            {
              attachments: true,
              certificateOfService: false,
              certificateOfServiceDate: null,
              documentTitle: 'Secondary Supporting Document One Title',
              objections: OBJECTIONS_OPTIONS_MAP.NO,
            },
            {
              attachments: false,
              certificateOfService: false,
              certificateOfServiceDate: null,
              documentTitle: 'Secondary Supporting Document Two Title',
              objections: OBJECTIONS_OPTIONS_MAP.UNKNOWN,
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
              objections: OBJECTIONS_OPTIONS_MAP.NO,
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

  describe('trialCalendar', () => {
    it('generates a Trial Calendar document', async () => {
      const pdf = await trialCalendar({
        applicationContext,
        data: {
          cases: [
            {
              caseTitle: 'Paul Simon',
              docketNumber: '123-45S',
              petitionerCounsel: ['Ben Matlock', 'Atticus Finch'],
              respondentCounsel: ['Sonny Crockett', 'Ricardo Tubbs'],
            },
            {
              caseTitle: 'Art Garfunkel',
              docketNumber: '234-56',
              petitionerCounsel: ['Mick Haller'],
              respondentCounsel: ['Joy Falotico'],
            },
          ],
          sessionDetail: {
            address1: '123 Some Street',
            address2: 'Suite B',
            courtReporter: 'Lois Lane',
            courthouseName: 'Test Courthouse',
            formattedCityStateZip: 'New York, NY 10108',
            irsCalendarAdministrator: 'iCalRS Admin',
            judge: 'Joseph Dredd',
            notes:
              'The one with the velour shirt is definitely looking at me funny.',
            sessionType: 'Hybrid',
            startDate: 'May 1, 2020',
            startTime: '10:00am',
            trialClerk: 'Clerky McGee',
            trialLocation: 'New York City, New York',
          },
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Trial_Calendar', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });

  describe('trialSessionPlanningReport', () => {
    it('generates a Trial Session Planning Report document', async () => {
      const pdf = await trialSessionPlanningReport({
        applicationContext,
        data: {
          locationData: [
            {
              allCaseCount: 5,
              previousTermsData: [['(S) Buch', '(R) Cohen'], [], []],
              regularCaseCount: 3,
              smallCaseCount: 2,
              stateAbbreviation: 'AR',
              trialCityState: 'Little Rock, AR',
            },
            {
              allCaseCount: 2,
              previousTermsData: [[], [], []],
              regularCaseCount: 1,
              smallCaseCount: 1,
              stateAbbreviation: 'AL',
              trialCityState: 'Mobile, AL',
            },
          ],
          previousTerms: [
            {
              name: 'fall',
              termDisplay: 'Fall 2019',
              year: '2019',
            },
            {
              name: 'spring',
              termDisplay: 'Spring 2019',
              year: '2019',
            },
            {
              name: 'winter',
              termDisplay: 'Winter 2019',
              year: '2019',
            },
          ],
          term: 'Winter 2020',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Trial_Session_Planning_Report', pdf);
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
