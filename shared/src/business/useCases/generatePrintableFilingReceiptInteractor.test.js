const {
  generatePrintableFilingReceiptInteractor,
} = require('./generatePrintableFilingReceiptInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');

describe('generatePrintableFilingReceiptInteractor', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({
        url: 'example.com/download-this',
      });
    applicationContext
      .getTemplateGenerators()
      .generatePrintableFilingReceiptTemplate.mockImplementation(
        ({ content }) => {
          return `<!DOCTYPE html><html>${content.documentsFiledContent}</html>`;
        },
      );
    applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor.mockImplementation(({ contentHtml }) => {
        return contentHtml;
      });
  });

  it('Calls generatePrintableFilingReceiptTemplate and generatePdfFromHtmlInteractor to build a PDF, then saveDocumentFromLambda and getDownloadPolicyUrl to store the PDF and return the link to it for a single primary document', async () => {
    await generatePrintableFilingReceiptInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentsFiled: {
        primaryDocumentFile: {},
      },
    });

    expect(
      applicationContext.getTemplateGenerators()
        .generatePrintableFilingReceiptTemplate,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().generatePdfFromHtmlInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getDownloadPolicyUrl,
    ).toHaveBeenCalled();
  });

  it('Displays `Attachment(s)` and Certificate of Service if present on a document', async () => {
    await generatePrintableFilingReceiptInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentsFiled: {
        attachments: true,
        certificateOfService: true,
        certificateOfServiceDate: '1983-10-31T09:38:18.614Z',
        documentTitle: 'Test Primary Document',
        primaryDocumentFile: {},
      },
    });

    const {
      contentHtml,
    } = applicationContext.getUseCases().generatePdfFromHtmlInteractor.mock.calls[0][0];

    expect(contentHtml.indexOf('<!DOCTYPE html>')).toBe(0);
    expect(contentHtml.includes('Document Includes')).toBeTruthy();
    expect(contentHtml.includes('Attachment(s)')).toBeTruthy();
    expect(contentHtml.includes('Certificate of Service')).toBeTruthy();
  });

  it('Displays Objections status when there are objections', async () => {
    await generatePrintableFilingReceiptInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentsFiled: {
        documentTitle: 'Test Primary Document',
        objections: 'Yes',
        primaryDocumentFile: {},
      },
    });

    const {
      contentHtml,
    } = applicationContext.getUseCases().generatePdfFromHtmlInteractor.mock.calls[0][0];

    expect(contentHtml.includes('Document Includes')).toBeFalsy();
    expect(contentHtml.includes('Objections')).toBeTruthy();
  });

  it('Displays No Objections status when there are no objections', async () => {
    await generatePrintableFilingReceiptInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentsFiled: {
        documentTitle: 'Test Primary Document',
        objections: 'No',
        primaryDocumentFile: {},
      },
    });

    const {
      contentHtml,
    } = applicationContext.getUseCases().generatePdfFromHtmlInteractor.mock.calls[0][0];

    expect(contentHtml.includes('Document Includes')).toBeFalsy();
    expect(contentHtml.includes('No Objections')).toBeTruthy();
  });

  it('Displays Unknown Objections status when there are no objections', async () => {
    await generatePrintableFilingReceiptInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentsFiled: {
        documentTitle: 'Test Primary Document',
        objections: 'Unknown',
        primaryDocumentFile: {},
      },
    });

    const {
      contentHtml,
    } = applicationContext.getUseCases().generatePdfFromHtmlInteractor.mock.calls[0][0];

    expect(contentHtml.includes('Document Includes')).toBeFalsy();
    expect(contentHtml.includes('Unknown Objections')).toBeTruthy();
  });

  it('Displays supporting documents if present in the filing', async () => {
    await generatePrintableFilingReceiptInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentsFiled: {
        attachments: true,
        certificateOfService: true,
        certificateOfServiceDate: '1983-10-31T09:38:18.614Z',
        documentTitle: 'Test Primary Document',
        hasSupportingDocuments: true,
        primaryDocumentFile: {},
        supportingDocuments: [
          {
            documentTitle: 'Test Supporting Document',
          },
        ],
      },
    });

    const {
      contentHtml,
    } = applicationContext.getUseCases().generatePdfFromHtmlInteractor.mock.calls[0][0];

    expect(contentHtml.includes('Test Primary Document')).toBeTruthy();
    expect(contentHtml.includes('Test Supporting Document')).toBeTruthy();
  });

  it('Displays secondary document if present in the filing', async () => {
    await generatePrintableFilingReceiptInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentsFiled: {
        attachments: true,
        certificateOfService: true,
<<<<<<< HEAD
        certificateOfServiceDate: '1983-10-31T06:25:41.239Z',
=======
        certificateOfServiceDate: '1983-10-31T09:38:18.614Z',
>>>>>>> cb0e6f38e57beb71bcdceaf4165168673cf03fd7
        documentTitle: 'Test Primary Document',
        primaryDocumentFile: {},
        secondaryDocument: {
          documentTitle: 'Test Secondary Document',
        },
        secondaryDocumentFile: {},
      },
    });

    const {
      contentHtml,
    } = applicationContext.getUseCases().generatePdfFromHtmlInteractor.mock.calls[0][0];

    expect(contentHtml.includes('Test Primary Document')).toBeTruthy();
    expect(contentHtml.includes('Test Secondary Document')).toBeTruthy();
  });

  it('Displays secondary supporting documents if present in the filing', async () => {
    await generatePrintableFilingReceiptInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentsFiled: {
        attachments: true,
        certificateOfService: true,
<<<<<<< HEAD
        certificateOfServiceDate: '1983-10-31T06:25:41.239Z',
=======
        certificateOfServiceDate: '1983-10-31T09:38:18.614Z',
>>>>>>> cb0e6f38e57beb71bcdceaf4165168673cf03fd7
        documentTitle: 'Test Primary Document',
        hasSecondarySupportingDocuments: true,
        hasSupportingDocuments: false,
        primaryDocumentFile: {},
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

    const {
      contentHtml,
    } = applicationContext.getUseCases().generatePdfFromHtmlInteractor.mock.calls[0][0];

    expect(contentHtml.includes('Test Primary Document')).toBeTruthy();
    expect(
      contentHtml.includes('Test Secondary Supporting Document'),
    ).toBeTruthy();
    expect(
      contentHtml.includes('Test Secondary Supporting Document 2'),
    ).toBeTruthy();
  });

  it('Displays primary and secondary supporting documents if present in the filing', async () => {
    await generatePrintableFilingReceiptInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentsFiled: {
        attachments: true,
        certificateOfService: true,
<<<<<<< HEAD
        certificateOfServiceDate: '1983-10-31T06:25:41.239Z',
=======
        certificateOfServiceDate: '1983-10-31T09:38:18.614Z',
>>>>>>> cb0e6f38e57beb71bcdceaf4165168673cf03fd7
        documentTitle: 'Test Primary Document',
        hasSecondarySupportingDocuments: true,
        hasSupportingDocuments: true,
        primaryDocumentFile: {},
        secondarySupportingDocuments: [
          {
            documentTitle: 'Test Secondary Supporting Document',
          },
          {
            documentTitle: 'Test Secondary Supporting Document 2',
          },
        ],
        supportingDocuments: [
          {
            documentTitle: 'Test Supporting Document',
          },
          {
            documentTitle: 'Test Supporting Document 2',
          },
        ],
      },
    });

    const {
      contentHtml,
    } = applicationContext.getUseCases().generatePdfFromHtmlInteractor.mock.calls[0][0];

    expect(contentHtml.includes('Test Primary Document')).toBeTruthy();
    expect(contentHtml.includes('Test Supporting Document')).toBeTruthy();
    expect(contentHtml.includes('Test Supporting Document 2')).toBeTruthy();
    expect(
      contentHtml.includes('Test Secondary Supporting Document'),
    ).toBeTruthy();
    expect(
      contentHtml.includes('Test Secondary Supporting Document 2'),
    ).toBeTruthy();
  });
});
