import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { enqueueAddCoversheet } from './enqueueAddCoversheet';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { updateDocketEntryProcessingStatus as updateDocketEntryProcessingStatusMock } from '@web-api/persistence/postgres/docketEntries/updateDocketEntryProcessingStatus';

const updateDocketEntryProcessingStatus = jest.mocked(
  updateDocketEntryProcessingStatusMock,
);

describe('enqueueAddCoversheet', () => {
  beforeEach(() => {
    updateDocketEntryProcessingStatus.mockReset();
  });

  it('dispatches an ADD_COVERSHEET message via the worker gateway', async () => {
    await enqueueAddCoversheet(applicationContext, {
      authorizedUser: mockDocketClerkUser,
      docketEntryId: 'abc',
      docketNumber: '101-25',
    });

    expect(
      applicationContext.getWorkerGateway().queueWork,
    ).toHaveBeenCalledWith(applicationContext, {
      message: {
        authorizedUser: mockDocketClerkUser,
        payload: { docketEntryId: 'abc', docketNumber: '101-25' },
        type: 'ADD_COVERSHEET',
      },
    });
  });

  it('marks the docket entry processingStatus as pending before queueing so the client poll waits for the worker', async () => {
    await enqueueAddCoversheet(applicationContext, {
      authorizedUser: mockDocketClerkUser,
      docketEntryId: 'abc',
      docketNumber: '101-25',
    });

    expect(updateDocketEntryProcessingStatus).toHaveBeenCalledWith({
      docketEntryId: 'abc',
      docketNumber: '101-25',
      processingStatus: 'pending',
    });
  });
});
