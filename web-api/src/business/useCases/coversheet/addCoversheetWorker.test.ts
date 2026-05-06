import '@web-api/persistence/postgres/docketEntries/mocks.jest';
jest.mock('@web-api/business/useCases/addCoversheetInteractor');
import { DOCUMENT_PROCESSING_STATUS_OPTIONS } from '@shared/business/entities/EntityConstants';
import { addCoversheetInteractor as addCoversheetInteractorMock } from '@web-api/business/useCases/addCoversheetInteractor';
import { addCoversheetWorkerHandler } from './addCoversheetWorker';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getDocketEntriesByDocketNumberAndDocketEntryId as getDocketEntriesByDocketNumberAndDocketEntryIdMock } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { updateDocketEntryProcessingStatus as updateDocketEntryProcessingStatusMock } from '@web-api/persistence/postgres/docketEntries/updateDocketEntryProcessingStatus';

describe('addCoversheetWorkerHandler', () => {
  const addCoversheetInteractor = jest.mocked(addCoversheetInteractorMock);
  const getDocketEntriesByDocketNumberAndDocketEntryId = jest.mocked(
    getDocketEntriesByDocketNumberAndDocketEntryIdMock,
  );
  const updateDocketEntryProcessingStatus = jest.mocked(
    updateDocketEntryProcessingStatusMock,
  );

  beforeEach(() => {
    addCoversheetInteractor.mockReset();
    getDocketEntriesByDocketNumberAndDocketEntryId.mockReset();
    updateDocketEntryProcessingStatus.mockReset();
  });

  it('calls addCoversheetInteractor when the docket entry is in pending state', async () => {
    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
      { processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING } as any,
    ]);

    await addCoversheetWorkerHandler(
      applicationContext as any,
      { docketEntryId: 'a1', docketNumber: '101-25' },
      mockDocketClerkUser,
    );

    expect(addCoversheetInteractor).toHaveBeenCalledWith(
      applicationContext,
      { docketEntryId: 'a1', docketNumber: '101-25' },
      mockDocketClerkUser,
    );
  });

  it('skips addCoversheetInteractor when the docket entry is already complete (idempotent)', async () => {
    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
      { processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE } as any,
    ]);

    await addCoversheetWorkerHandler(
      applicationContext as any,
      { docketEntryId: 'a1', docketNumber: '101-25' },
      mockDocketClerkUser,
    );

    expect(addCoversheetInteractor).not.toHaveBeenCalled();
  });

  it('skips when the docket entry cannot be found (stale SQS message)', async () => {
    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([]);

    await addCoversheetWorkerHandler(
      applicationContext as any,
      { docketEntryId: 'missing', docketNumber: '101-25' },
      mockDocketClerkUser,
    );

    expect(addCoversheetInteractor).not.toHaveBeenCalled();
  });

  it('writes ERROR_ADDING_COVERSHEET and rethrows when the interactor throws, so SQS sees the failure and the message lands in the DLQ', async () => {
    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
      { processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING } as any,
    ]);
    const cause = new Error('pdf generation blew up');
    addCoversheetInteractor.mockRejectedValue(cause);

    await expect(
      addCoversheetWorkerHandler(
        applicationContext as any,
        { docketEntryId: 'a1', docketNumber: '101-25' },
        mockDocketClerkUser,
      ),
    ).rejects.toBe(cause);

    expect(updateDocketEntryProcessingStatus).toHaveBeenCalledWith({
      docketEntryId: 'a1',
      docketNumber: '101-25',
      processingStatus:
        DOCUMENT_PROCESSING_STATUS_OPTIONS.ERROR_ADDING_COVERSHEET,
    });
  });
});
