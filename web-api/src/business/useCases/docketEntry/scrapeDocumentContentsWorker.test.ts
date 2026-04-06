jest.mock('@web-api/persistence/postgres/cases/getCaseByDocketNumber');
jest.mock('@web-api/persistence/postgres/docketEntries/upsertDocketEntries');
import { Case } from '@shared/business/entities/cases/Case';
import { MOCK_CASE } from '@shared/test/mockCase';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { docketClerkUser } from '@shared/test/mockUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { scrapeDocumentContentsWorker } from '@web-api/business/useCases/docketEntry/scrapeDocumentContentsWorker';
import { upsertDocketEntries as upsertDocketEntriesMock } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';

const mockCaseCaption = MOCK_CASE.caseCaption;
const mockDocketEntryId = '22258391-07c1-40ef-b44c-dbea49893a30';
const mockDocumentStorageId = '5c07e592-4113-460b-b81e-ebf659b777ec';
const mockDocketNumber = MOCK_CASE.docketNumber;
const mockDocketNumberWithSuffix = MOCK_CASE.docketNumberWithSuffix;
const mockDocketEntry = {
  docketEntryId: mockDocketEntryId,
  documentStorageId: mockDocumentStorageId,
  docketNumber: MOCK_CASE.docketNumber,
  documentTitle: 'Order',
  documentType: 'Order',
  eventCode: 'O',
  filedByRole: 'docketclerk',
  signedAt: '2025-03-01T23:00:00.000Z',
  signedByUserId: docketClerkUser.userId,
  signedJudgeName: 'Dredd',
  userId: docketClerkUser.userId,
};
const mockCase = {
  ...MOCK_CASE,
  docketEntries: [...MOCK_CASE.docketEntries, mockDocketEntry],
};
const mockAuthUser = mockDocketClerkUser;
const mockScrapeDocumentContentsMessage = {
  docketEntryId: mockDocketEntryId,
  docketNumber: mockDocketNumber,
};
const mockPdfBlob = 'totally real pdf binary blob';
const mockPdfContents = 'totally real pdf contents';

const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
const upsertDocketEntries = upsertDocketEntriesMock as jest.Mock;
upsertDocketEntries.mockImplementation(jest.fn());

describe('scrapeDocumentContentsWorker', () => {
  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue(mockCase as Case);
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockResolvedValue(mockPdfBlob);
    applicationContext
      .getUseCaseHelpers()
      .parseAndScrapePdfContents.mockResolvedValue(mockPdfContents);
  });

  it('throws an error if the auth user is not authorized to edit an order', async () => {
    await expect(
      scrapeDocumentContentsWorker(
        applicationContext,
        mockScrapeDocumentContentsMessage,
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the case does not exist', async () => {
    const nonExtantDocketNumber = '99999999999999-99';
    getCaseByDocketNumber.mockRejectedValueOnce(
      new Error(`Cases ${nonExtantDocketNumber} not found`),
    );
    await expect(
      scrapeDocumentContentsWorker(
        applicationContext,
        {
          ...mockScrapeDocumentContentsMessage,
          docketNumber: nonExtantDocketNumber,
        },
        mockAuthUser,
      ),
    ).rejects.toThrow(`Cases ${nonExtantDocketNumber} not found`);
  });

  it('reads the case from persistence', async () => {
    await scrapeDocumentContentsWorker(
      applicationContext,
      mockScrapeDocumentContentsMessage,
      mockAuthUser,
    );
    expect(getCaseByDocketNumber).toHaveBeenCalledWith({
      docketNumber: mockScrapeDocumentContentsMessage.docketNumber,
    });
  });

  it('throws an error if the docket entry does not exist on the case', async () => {
    const nonExtantDocketEntryId = '5fbe40b3-24af-48cb-abad-7cfaa1571bbb';
    await expect(
      scrapeDocumentContentsWorker(
        applicationContext,
        {
          ...mockScrapeDocumentContentsMessage,
          docketEntryId: nonExtantDocketEntryId,
        },
        mockAuthUser,
      ),
    ).rejects.toThrow(
      `scrapeDocumentContentsWorker: Docket entry ${nonExtantDocketEntryId} not found`,
    );
  });

  it('throws an error if the docket entry pdf does not exist in s3', async () => {
    const errorMessage = `Unable to get document (${mockDocketEntryId}) from persistence.`;
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockRejectedValueOnce(errorMessage);
    await expect(
      scrapeDocumentContentsWorker(
        applicationContext,
        mockScrapeDocumentContentsMessage,
        mockAuthUser,
      ),
    ).rejects.toBe(errorMessage);
  });

  it('reads the docket entry pdf contents from s3', async () => {
    await scrapeDocumentContentsWorker(
      applicationContext,
      mockScrapeDocumentContentsMessage,
      mockAuthUser,
    );
    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalledWith(
      expect.objectContaining({ key: mockDocumentStorageId }),
    );
  });

  it('throws an error if the docket entry pdf could not be parsed', async () => {
    const errorMessage = 'Failed to parse PDF';
    applicationContext
      .getUseCaseHelpers()
      .parseAndScrapePdfContents.mockRejectedValueOnce(errorMessage);
    await expect(
      scrapeDocumentContentsWorker(
        applicationContext,
        mockScrapeDocumentContentsMessage,
        mockAuthUser,
      ),
    ).rejects.toBe(errorMessage);
  });

  it("parses the docket entry's pdf contents", async () => {
    await scrapeDocumentContentsWorker(
      applicationContext,
      mockScrapeDocumentContentsMessage,
      mockAuthUser,
    );
    expect(
      applicationContext.getUseCaseHelpers().parseAndScrapePdfContents,
    ).toHaveBeenCalledWith(expect.objectContaining({ pdfBuffer: mockPdfBlob }));
  });

  it('only appends the docket number and case caption if both are present', async () => {
    // no caseCaption/no docketNumberWithSuffix
    getCaseByDocketNumber.mockResolvedValueOnce({
      ...mockCase,
      caseCaption: undefined,
      docketNumberWithSuffix: undefined,
    });
    await scrapeDocumentContentsWorker(
      applicationContext,
      mockScrapeDocumentContentsMessage,
      mockAuthUser,
    );
    const contents = { documentContents: mockPdfContents };
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        document: Buffer.from(JSON.stringify(contents)),
      }),
    );

    // no caseCaption/yes docketNumberWithSuffix
    getCaseByDocketNumber.mockResolvedValueOnce({
      ...mockCase,
      caseCaption: undefined,
    });
    await scrapeDocumentContentsWorker(
      applicationContext,
      mockScrapeDocumentContentsMessage,
      mockAuthUser,
    );
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        document: Buffer.from(JSON.stringify(contents)),
      }),
    );

    // yes caseCaption/no docketNumberWithSuffix
    getCaseByDocketNumber.mockResolvedValueOnce({
      ...mockCase,
      docketNumberWithSuffix: undefined,
    });
    await scrapeDocumentContentsWorker(
      applicationContext,
      mockScrapeDocumentContentsMessage,
      mockAuthUser,
    );
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        document: Buffer.from(JSON.stringify(contents)),
      }),
    );

    // yes caseCaption/yes docketNumberWithSuffix
    const compositeContents = {
      documentContents: `${mockPdfContents} ${mockDocketNumberWithSuffix} ${mockCaseCaption}`,
    };
    await scrapeDocumentContentsWorker(
      applicationContext,
      mockScrapeDocumentContentsMessage,
      mockAuthUser,
    );
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        document: Buffer.from(JSON.stringify(compositeContents)),
      }),
    );
  });

  it('updates the docket entry in postgres with new documentContentsId', async () => {
    await scrapeDocumentContentsWorker(
      applicationContext,
      mockScrapeDocumentContentsMessage,
      mockAuthUser,
    );
    expect(upsertDocketEntries).toHaveBeenCalledWith([
      expect.objectContaining({
        docketNumber: mockDocketNumber,
        docketEntryId: mockDocketEntryId,
        documentContentsId: expect.any(String),
      }),
    ]);
  });

  it('logs pertinent information', async () => {
    await scrapeDocumentContentsWorker(
      applicationContext,
      mockScrapeDocumentContentsMessage,
      mockAuthUser,
    );
    expect(applicationContext.logger.info).toHaveBeenCalledTimes(6);
  });
});
