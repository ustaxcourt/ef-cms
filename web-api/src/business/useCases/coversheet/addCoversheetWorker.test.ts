import '@web-api/persistence/postgres/docketEntries/mocks.jest';
jest.mock('@web-api/business/useCases/addCoversheetInteractor');
import { DOCUMENT_PROCESSING_STATUS_OPTIONS } from '@shared/business/entities/EntityConstants';
import { addCoversheetInteractor as addCoversheetInteractorMock } from '@web-api/business/useCases/addCoversheetInteractor';
import { addCoversheetWorkerHandler } from './addCoversheetWorker';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getDocketEntriesByDocketNumberAndDocketEntryId as getDocketEntriesByDocketNumberAndDocketEntryIdMock } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('addCoversheetWorkerHandler', () => {
  const addCoversheetInteractor = jest.mocked(addCoversheetInteractorMock);
  const getDocketEntriesByDocketNumberAndDocketEntryId = jest.mocked(
    getDocketEntriesByDocketNumberAndDocketEntryIdMock,
  );

  beforeEach(() => {
    addCoversheetInteractor.mockReset();
    getDocketEntriesByDocketNumberAndDocketEntryId.mockReset();
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
});
