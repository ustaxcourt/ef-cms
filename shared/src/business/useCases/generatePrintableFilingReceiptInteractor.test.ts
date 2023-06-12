import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_USERS } from '../../test/mockUsers';
import { applicationContext } from '../test/createTestApplicationContext';
import { generatePrintableFilingReceiptInteractor } from './generatePrintableFilingReceiptInteractor';
import { getContactPrimary } from '../entities/cases/Case';

describe('generatePrintableFilingReceiptInteractor', () => {
  const mockPrimaryDocketEntryId = MOCK_CASE.docketEntries[0].docketEntryId;
  const mockConsolidatedCases = [
    {
      docketNumber: '103-23',
      entityName: 'Case',
      leadDocketNumber: '101-18',
      sortableDocketNumber: 2023000103,
    },
    {
      ...MOCK_CASE,
      docketNumber: '101-18',
      leadDocketNumber: '101-18',
    },
    {
      docketNumber: '102-23',
      entityName: 'Case',
      leadDocketNumber: '101-18',
      sortableDocketNumber: 2023000102,
    },
    {
      docketNumber: '104-23',
      entityName: 'Case',
      leadDocketNumber: '101-18',
      sortableDocketNumber: 2023000104,
    },
  ];

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
      fileAcrossConsolidatedGroup: false,
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
      fileAcrossConsolidatedGroup: false,
    });

    const receiptMockCall =
      applicationContext.getDocumentGenerators().receiptOfFiling.mock
        .calls[0][0].data; // 'data' property of first arg (an object) of first call

    const expectedFilingDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(MOCK_CASE.docketEntries[0].filingDate, 'DATE_TIME_TZ');

    expect(receiptMockCall.filedBy).toBe(getContactPrimary(MOCK_CASE).name);
    expect(receiptMockCall.filedAt).toBe(expectedFilingDateFormatted);
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
      fileAcrossConsolidatedGroup: false,
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
      fileAcrossConsolidatedGroup: false,
    });

    const receiptMockCall =
      applicationContext.getDocumentGenerators().receiptOfFiling.mock
        .calls[0][0].data;
    expect(receiptMockCall.document.formattedCertificateOfServiceDate).toEqual(
      '08/25/19',
    );
  });

  it('should call the Receipt of Filing document generator with consolidatedCases array populated when fileAcrossConsolidatedGroup is true', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockResolvedValue(mockConsolidatedCases);

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
      fileAcrossConsolidatedGroup: true,
    });

    const receiptMockCall =
      applicationContext.getDocumentGenerators().receiptOfFiling.mock
        .calls[0][0].data; // 'data' property of first arg (an object) of first call
    expect(
      applicationContext.getPersistenceGateway().getCasesByLeadDocketNumber,
    ).toHaveBeenCalled();
    expect(receiptMockCall.consolidatedCasesDocketNumbers).toEqual(
      expect.arrayContaining([
        mockConsolidatedCases[1].docketNumber,
        mockConsolidatedCases[2].docketNumber,
        mockConsolidatedCases[0].docketNumber,
        mockConsolidatedCases[3].docketNumber,
      ]),
    );
  });

  it('should call the Receipt of Filing document generator with consolidatedCases array unpopulated (emptyArray) when fileAcrossConsolidatedGroup is true', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockResolvedValue(mockConsolidatedCases);

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
      fileAcrossConsolidatedGroup: false,
    });

    const receiptMockCall =
      applicationContext.getDocumentGenerators().receiptOfFiling.mock
        .calls[0][0].data; // 'data' property of first arg (an object) of first call
    expect(
      applicationContext.getPersistenceGateway().getCasesByLeadDocketNumber,
    ).not.toHaveBeenCalled();
    expect(receiptMockCall.consolidatedCasesDocketNumbers.length).toEqual(0);
  });
});
