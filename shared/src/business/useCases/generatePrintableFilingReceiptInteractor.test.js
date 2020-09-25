const {
  generatePrintableFilingReceiptInteractor,
} = require('./generatePrintableFilingReceiptInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
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
    await generatePrintableFilingReceiptInteractor({
      applicationContext,
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
    await generatePrintableFilingReceiptInteractor({
      applicationContext,
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

    const receiptMockCall = applicationContext.getDocumentGenerators()
      .receiptOfFiling.mock.calls[0][0].data; // 'data' property of first arg (an object) of first call
    expect(receiptMockCall.filedBy).toBe(MOCK_CASE.contactPrimary.name);
  });

  it('acquires document information', async () => {
    await generatePrintableFilingReceiptInteractor({
      applicationContext,
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

    const receiptMockCall = applicationContext.getDocumentGenerators()
      .receiptOfFiling.mock.calls[0][0].data; // 'data' property of first arg (an object) of first call
    expect(receiptMockCall.supportingDocuments.length).toBe(2);
    expect(receiptMockCall.secondarySupportingDocuments.length).toBe(2);
    expect(receiptMockCall.secondaryDocument).toBeDefined();
  });
});
