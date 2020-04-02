import {
  generateHtmlForFilingReceipt,
  generatePrintableFilingReceiptInteractor,
} from './generatePrintableFilingReceiptInteractor';
const { applicationContext } = require('../test/createTestApplicationContext');

const { MOCK_USERS } = require('../../test/mockUsers');

let generatePdfFromHtmlInteractorMock;
let generatePrintableFilingReceiptTemplateMock;
let saveDocumentFromLambdaMock;
let getDownloadPolicyUrlMock;
let caseDetail;

describe('generatePrintableFilingReceiptInteractor', () => {
  beforeEach(() => {
    generatePdfFromHtmlInteractorMock = jest.fn();
    generatePrintableFilingReceiptTemplateMock = jest.fn();
    saveDocumentFromLambdaMock = jest.fn();
    getDownloadPolicyUrlMock = jest.fn().mockReturnValue({
      url: 'a-document-download-url',
    });

    caseDetail = {
      caseCaption: 'Test Case Caption',
      caseId: 'ca-123',
      contactPrimary: {
        address1: 'address 1',
        city: 'City',
        countryType: 'domestic',
        name: 'Test Petitioner',
        phone: '123-123-1234',
        postalCode: '12345',
        state: 'ST',
      },
      docketNumber: '123-45',
      docketNumberSuffix: 'S',
      documents: [
        {
          documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
        },
        {
          documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fe',
        },
        {
          additionalInfo2: 'Additional Info 2',
          documentId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fe',
          isStatusServed: true,
          servedAtFormatted: '03/27/19',
        },
      ],
      irsPractitioners: [],
      privatePractitioners: [],
    };

    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(caseDetail);
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockImplementation(getDownloadPolicyUrlMock);
    applicationContext
      .getPersistenceGateway()
      .saveDocumentFromLambda.mockImplementation(saveDocumentFromLambdaMock);

    applicationContext
      .getTemplateGenerators()
      .generatePrintableFilingReceiptTemplate.mockImplementation(
        ({ content }) => {
          generatePrintableFilingReceiptTemplateMock();
          return `<!DOCTYPE html>${content.documentsFiledContent}</html>`;
        },
      );

    applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor.mockImplementation(({ contentHtml }) => {
        generatePdfFromHtmlInteractorMock();
        return contentHtml;
      });
  });

  it('Calls generatePrintableFilingReceiptTemplate and generatePdfFromHtmlInteractor to build a PDF, then saveDocumentFromLambda and getDownloadPolicyUrl to store the PDF and return the link to it', async () => {
    await generatePrintableFilingReceiptInteractor({
      applicationContext,
      documents: {
        primaryDocument: {
          attachments: false,
          certificateOfService: false,
          documentTitle: 'Test Primary Document',
        },
      },
    });

    expect(generatePrintableFilingReceiptTemplateMock).toHaveBeenCalled();
    expect(generatePdfFromHtmlInteractorMock).toHaveBeenCalled();
    expect(saveDocumentFromLambdaMock).toHaveBeenCalled();
    expect(getDownloadPolicyUrlMock).toHaveBeenCalled();
  });

  it('Displays `Attachment(s)` and Certificate of Service if present on a document', async () => {
    const { contentHtml: result } = await generateHtmlForFilingReceipt({
      applicationContext,
      documents: {
        primaryDocument: {
          attachments: true,
          certificateOfService: true,
          certificateOfServiceDate: '10-31-1983',
          documentTitle: 'Test Primary Document',
        },
      },
    });

    expect(result.indexOf('<!DOCTYPE html>')).toBe(0);
    expect(result.indexOf('Document Includes')).toBeGreaterThan(-1);
    expect(result.indexOf('Attachment(s)')).toBeGreaterThan(-1);
    expect(result.indexOf('Certificate of Service')).toBeGreaterThan(-1);
  });

  it('Displays Objections status when there are objections', async () => {
    const { contentHtml: result } = await generateHtmlForFilingReceipt({
      applicationContext,
      documents: {
        primaryDocument: {
          documentTitle: 'Test Primary Document',
          objections: 'Yes',
        },
      },
    });

    expect(result.indexOf('Document Includes')).toEqual(-1);
    expect(result.indexOf('Objections')).toBeGreaterThan(-1);
  });

  it('Displays No Objections status when there are no objections', async () => {
    const { contentHtml: result } = await generateHtmlForFilingReceipt({
      applicationContext,
      documents: {
        primaryDocument: {
          documentTitle: 'Test Primary Document',
          objections: 'No',
        },
      },
    });

    expect(result.indexOf('Document Includes')).toEqual(-1);
    expect(result.indexOf('No Objections')).toBeGreaterThan(-1);
  });

  it('Displays Unknown Objections status when there are no objections', async () => {
    const { contentHtml: result } = await generateHtmlForFilingReceipt({
      applicationContext,
      documents: {
        primaryDocument: {
          documentTitle: 'Test Primary Document',
          objections: 'Unknown',
        },
      },
    });

    expect(result.indexOf('Document Includes')).toEqual(-1);
    expect(result.indexOf('Unknown Objections')).toBeGreaterThan(-1);
  });

  it('Displays supporting documents if present in the filing', async () => {
    const { contentHtml: result } = await generateHtmlForFilingReceipt({
      applicationContext,
      documents: {
        hasSupportingDocuments: true,
        primaryDocument: {
          attachments: true,
          certificateOfService: true,
          certificateOfServiceDate: '10-31-1983',
          documentTitle: 'Test Primary Document',
        },
        supportingDocuments: [
          {
            documentTitle: 'Test Supporting Document',
          },
        ],
      },
    });

    expect(result.indexOf('Test Primary Document')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Supporting Document')).toBeGreaterThan(-1);
  });

  it('Displays secondary document if present in the filing', async () => {
    const { contentHtml: result } = await generateHtmlForFilingReceipt({
      applicationContext,
      documents: {
        primaryDocument: {
          attachments: true,
          certificateOfService: true,
          certificateOfServiceDate: '10-31-1983',
          documentTitle: 'Test Primary Document',
        },
        secondaryDocument: {
          documentTitle: 'Test Secondary Document',
        },
      },
    });

    expect(result.indexOf('Test Primary Document')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Secondary Document')).toBeGreaterThan(-1);
  });

  it('Displays secondary supporting documents if present in the filing', async () => {
    const { contentHtml: result } = await generateHtmlForFilingReceipt({
      applicationContext,
      documents: {
        hasSecondarySupportingDocuments: true,
        hasSupportingDocuments: false,
        primaryDocument: {
          attachments: true,
          certificateOfService: true,
          certificateOfServiceDate: '10-31-1983',
          documentTitle: 'Test Primary Document',
        },
        secondarySupportingDocuments: [
          {
            documentTitle: 'Test Secondary Supporting Document',
          },
          {
            documentTitle: 'Test Secondary Supporting Document 2',
          },
        ],
      },
    });

    expect(result.indexOf('Test Primary Document')).toBeGreaterThan(-1);
    expect(
      result.indexOf('Test Secondary Supporting Document'),
    ).toBeGreaterThan(-1);
    expect(
      result.indexOf('Test Secondary Supporting Document 2'),
    ).toBeGreaterThan(-1);
  });
});
