const {
  generatePrintableFilingReceiptInteractor,
} = require('./generatePrintableFilingReceiptInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { getContactPrimary } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');

describe('generatePrintableFilingReceiptInteractor', () => {
  const mockPrimaryDocketEntryId = MOCK_CASE.docketEntries[0].docketEntryId;

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({
        url: 'example.com/download-this',
      });
  });

  it('should call the Receipt of Filing document generator', async () => {
    await generatePrintableFilingReceiptInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      documentsFiled: {
        primaryDocumentId: mockPrimaryDocketEntryId,
      },
    });

    expect(
      applicationContext.getDocumentGenerators().receiptOfFiling,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getDownloadPolicyUrl,
    ).toHaveBeenCalled();
  });

  it('should populate filedBy on the receipt of filing', async () => {
    await generatePrintableFilingReceiptInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      documentsFiled: {
        hasSecondarySupportingDocuments: true,
        hasSupportingDocuments: true,
        primaryDocumentId: mockPrimaryDocketEntryId,
        secondaryDocument: { docketEntryId: 4 },
        secondaryDocumentFile: { fakeDocument: true },
        secondarySupportingDocuments: [
          { docketEntryId: '3' },
          { docketEntryId: '7' },
        ],
        supportingDocuments: [{ docketEntryId: '1' }, { docketEntryId: '2' }],
      },
    });

    const receiptMockCall =
      applicationContext.getDocumentGenerators().receiptOfFiling.mock
        .calls[0][0].data; // 'data' property of first arg (an object) of first call

    const expectedFilingDateForamtted = applicationContext
      .getUtilities()
      .formatDateString(MOCK_CASE.docketEntries[0].filingDate, 'DATE_TIME_TZ');

    expect(receiptMockCall.filedBy).toBe(getContactPrimary(MOCK_CASE).name);
    expect(receiptMockCall.filedAt).toBe(expectedFilingDateForamtted);
  });

  it('acquires document information', async () => {
    await generatePrintableFilingReceiptInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      documentsFiled: {
        hasSecondarySupportingDocuments: true,
        hasSupportingDocuments: true,
        primaryDocumentId: mockPrimaryDocketEntryId,
        secondaryDocument: { docketEntryId: 4 },
        secondaryDocumentFile: { fakeDocument: true },
        secondarySupportingDocuments: [
          { docketEntryId: '3' },
          { docketEntryId: '7' },
        ],
        supportingDocuments: [{ docketEntryId: '1' }, { docketEntryId: '2' }],
      },
    });

    const receiptMockCall =
      applicationContext.getDocumentGenerators().receiptOfFiling.mock
        .calls[0][0].data; // 'data' property of first arg (an object) of first call
    expect(receiptMockCall.supportingDocuments.length).toBe(2);
    expect(receiptMockCall.secondarySupportingDocuments.length).toBe(2);
    expect(receiptMockCall.secondaryDocument).toBeDefined();
  });

  it('formats certificateOfServiceDate', async () => {
    await generatePrintableFilingReceiptInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      documentsFiled: {
        certificateOfService: true,
        certificateOfServiceDate: '2019-08-25T05:00:00.000Z',
        primaryDocumentId: mockPrimaryDocketEntryId,
      },
    });

    const receiptMockCall =
      applicationContext.getDocumentGenerators().receiptOfFiling.mock
        .calls[0][0].data;
    expect(receiptMockCall.document.formattedCertificateOfServiceDate).toEqual(
      '08/25/19',
    );
  });
});
