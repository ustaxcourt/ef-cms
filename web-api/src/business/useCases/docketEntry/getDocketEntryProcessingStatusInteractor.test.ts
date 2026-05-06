import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getDocketEntriesByDocketNumberAndDocketEntryId as getDocketEntriesByDocketNumberAndDocketEntryIdMock } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { getDocketEntryProcessingStatusInteractor } from './getDocketEntryProcessingStatusInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

jest.mock('@web-api/persistence/postgres/cases/getCaseByDocketNumber');

describe('getDocketEntryProcessingStatusInteractor', () => {
  const getDocketEntriesByDocketNumberAndDocketEntryId = jest.mocked(
    getDocketEntriesByDocketNumberAndDocketEntryIdMock,
  );
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);

  beforeEach(() => {
    getDocketEntriesByDocketNumberAndDocketEntryId.mockReset();
    getCaseByDocketNumber.mockReset();
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE as any);
  });

  it('returns the processingStatus of a docket entry for an internal user', async () => {
    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
      { processingStatus: 'pending' } as any,
    ]);

    const result = await getDocketEntryProcessingStatusInteractor(
      applicationContext,
      { docketEntryId: 'abc', docketNumber: MOCK_CASE.docketNumber },
      mockDocketClerkUser,
    );

    expect(result).toEqual({ processingStatus: 'pending' });
  });

  it('throws NotFoundError when the case does not exist', async () => {
    getCaseByDocketNumber.mockResolvedValue({} as any);

    await expect(
      getDocketEntryProcessingStatusInteractor(
        applicationContext,
        { docketEntryId: 'abc', docketNumber: '999-99' },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws NotFoundError when the docket entry does not exist', async () => {
    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([]);

    await expect(
      getDocketEntryProcessingStatusInteractor(
        applicationContext,
        { docketEntryId: 'missing', docketNumber: MOCK_CASE.docketNumber },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws UnauthorizedError for an external user not associated with the case', async () => {
    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
      { processingStatus: 'pending' } as any,
    ]);

    await expect(
      getDocketEntryProcessingStatusInteractor(
        applicationContext,
        { docketEntryId: 'abc', docketNumber: MOCK_CASE.docketNumber },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });
});
