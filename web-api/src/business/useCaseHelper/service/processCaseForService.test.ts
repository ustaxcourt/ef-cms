jest.mock('@web-api/persistence/postgres/utils/transactions');
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { Case } from '@shared/business/entities/cases/Case';
import { MOCK_CASE } from '@shared/test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { PDFDocument } from 'pdf-lib';
import { processCaseForService } from './processCaseForService';
import {
  inTransaction as inTransactionMock,
  onTransactionCommit as onTransactionCommitMock,
} from '@web-api/persistence/postgres/utils/transactions';

describe('processCaseForService', () => {
  const mockDocketEntryId = 'abc-123-def';
  const mockPdfData = Buffer.from('mock pdf data');
  let mockNewPdfDoc: PDFDocument;
  const mockNoticeDoc = {
    getPages: jest.fn().mockReturnValue([]),
  };
  const mockPDFDocument = {
    load: jest.fn().mockResolvedValue(mockNoticeDoc),
  };

  const inTransaction = jest.mocked(inTransactionMock);
  const onTransactionCommit = jest.mocked(onTransactionCommitMock);

  beforeEach(async () => {
    mockNewPdfDoc = await PDFDocument.create();

    applicationContext.getUseCaseHelpers.mockReturnValue({
      appendPaperServiceAddressPageToPdf: jest.fn(),
      sendServedPartiesEmails: jest.fn(),
    });

    inTransaction.mockReturnValue(false);
  });

  it('should aggregate served parties and send emails', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
      },
      { authorizedUser: mockDocketClerkUser },
    );

    const loadPdfDocument = jest.fn().mockResolvedValueOnce(mockPdfData);

    await processCaseForService({
      PDFDocument: mockPDFDocument,
      applicationContext,
      caseEntity,
      docketEntryId: mockDocketEntryId,
      loadPdfDocument,
      newPdfDoc: mockNewPdfDoc,
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalledWith({
      applicationContext,
      caseEntity,
      docketEntryId: mockDocketEntryId,
      servedParties: expect.objectContaining({
        electronic: expect.any(Array),
        paper: expect.any(Array),
      }),
    });
  });

  it('should add electronic parties when provided', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
      },
      { authorizedUser: mockDocketClerkUser },
    );

    const electronicParties = [
      { email: 'test@example.com', name: 'Test Party' },
    ];
    const loadPdfDocument = jest.fn().mockResolvedValueOnce(mockPdfData);

    await processCaseForService({
      PDFDocument: mockPDFDocument,
      applicationContext,
      caseEntity,
      docketEntryId: mockDocketEntryId,
      electronicParties,
      loadPdfDocument,
      newPdfDoc: mockNewPdfDoc,
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalledWith({
      applicationContext,
      caseEntity,
      docketEntryId: mockDocketEntryId,
      servedParties: expect.objectContaining({
        electronic: electronicParties,
      }),
    });
  });

  it('should load PDF and append paper service pages when there are paper service parties', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            serviceIndicator: 'Paper',
          },
        ],
      },
      { authorizedUser: mockDocketClerkUser },
    );

    const loadPdfDocument = jest.fn().mockResolvedValueOnce(mockPdfData);

    await processCaseForService({
      PDFDocument: mockPDFDocument,
      applicationContext,
      caseEntity,
      docketEntryId: mockDocketEntryId,
      loadPdfDocument,
      newPdfDoc: mockNewPdfDoc,
    });

    expect(loadPdfDocument).toHaveBeenCalled();
    expect(mockPDFDocument.load).toHaveBeenCalledWith(mockPdfData);
    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).toHaveBeenCalledWith({
      applicationContext,
      caseEntity,
      newPdfDoc: mockNewPdfDoc,
      noticeDoc: mockNoticeDoc,
      servedParties: expect.objectContaining({
        paper: expect.any(Array),
      }),
    });
  });

  it('should not load PDF or append pages when there are no paper service parties', async () => {
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            serviceIndicator: 'Electronic',
          },
        ],
      },
      { authorizedUser: mockDocketClerkUser },
    );

    const loadPdfDocument = jest.fn().mockResolvedValueOnce(mockPdfData);

    await processCaseForService({
      PDFDocument: mockPDFDocument,
      applicationContext,
      caseEntity,
      docketEntryId: mockDocketEntryId,
      loadPdfDocument,
      newPdfDoc: mockNewPdfDoc,
    });

    expect(loadPdfDocument).not.toHaveBeenCalled();
    expect(mockPDFDocument.load).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).not.toHaveBeenCalled();
  });

  it('should send service emails to onTransactionCommit if in a transaction', async () => {
    inTransaction.mockReturnValueOnce(true);

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
      },
      { authorizedUser: mockDocketClerkUser },
    );

    const loadPdfDocument = jest.fn().mockResolvedValueOnce(mockPdfData);

    await processCaseForService({
      PDFDocument: mockPDFDocument,
      applicationContext,
      caseEntity,
      docketEntryId: mockDocketEntryId,
      loadPdfDocument,
      newPdfDoc: mockNewPdfDoc,
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toHaveBeenCalled();
    expect(onTransactionCommit).toHaveBeenCalledTimes(1);
  });
});
