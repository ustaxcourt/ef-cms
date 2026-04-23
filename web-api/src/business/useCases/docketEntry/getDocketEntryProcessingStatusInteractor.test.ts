import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import { NotFoundError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getDocketEntriesByDocketNumberAndDocketEntryId as getDocketEntriesByDocketNumberAndDocketEntryIdMock } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { getDocketEntryProcessingStatusInteractor } from './getDocketEntryProcessingStatusInteractor';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('getDocketEntryProcessingStatusInteractor', () => {
  const getDocketEntriesByDocketNumberAndDocketEntryId = jest.mocked(
    getDocketEntriesByDocketNumberAndDocketEntryIdMock,
  );

  beforeEach(() => {
    getDocketEntriesByDocketNumberAndDocketEntryId.mockReset();
  });

  it('returns the processingStatus of a docket entry', async () => {
    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
      { processingStatus: 'pending' } as any,
    ]);

    const result = await getDocketEntryProcessingStatusInteractor(
      applicationContext,
      { docketEntryId: 'abc', docketNumber: '101-25' },
      mockDocketClerkUser,
    );

    expect(result).toEqual({ processingStatus: 'pending' });
  });

  it('throws NotFoundError when the docket entry does not exist', async () => {
    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([]);

    await expect(
      getDocketEntryProcessingStatusInteractor(
        applicationContext,
        { docketEntryId: 'missing', docketNumber: '101-25' },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(NotFoundError);
  });
});
