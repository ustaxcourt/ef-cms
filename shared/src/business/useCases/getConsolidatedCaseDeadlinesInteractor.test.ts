jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId',
);
jest.mock('@web-api/persistence/postgres/cases/getCasesByDocketNumbers');
import { getConsolidatedCaseDeadlinesInteractor } from '@shared/business/useCases/getConsolidatedCaseDeadlinesInteractor';
import { getUniqueId } from '@shared/sharedAppContext';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCaseDeadlinesByConsolidatedCaseDeadlineId as getCaseDeadlinesByConsolidatedCaseDeadlineIdMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

const getCaseDeadlinesByConsolidatedCaseDeadlineId =
  getCaseDeadlinesByConsolidatedCaseDeadlineIdMock as jest.Mock;

const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);

describe('getConsolidatedCaseDeadlinesInteractor', () => {
  const TEST_CONSOLIDATED_DEADLINE_ID = getUniqueId();

  it('should throw an "Unauthorized" error when the provided user does not have permissions', async () => {
    await expect(
      getConsolidatedCaseDeadlinesInteractor(
        {
          consolidatedCaseDeadlineId: TEST_CONSOLIDATED_DEADLINE_ID,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return no items if there are new consolidated case deadlines', async () => {
    getCaseDeadlinesByConsolidatedCaseDeadlineId.mockResolvedValue([]);

    const results = await getConsolidatedCaseDeadlinesInteractor(
      {
        consolidatedCaseDeadlineId: TEST_CONSOLIDATED_DEADLINE_ID,
      },
      mockDocketClerkUser,
    );

    expect(results.length).toEqual(0);
  });

  it('should return all the items if there are new consolidated case deadlines', async () => {
    const TEST_DOCKET_NUMBER = [
      '101-25',
      '102-25',
      '103-25',
      '104-25',
      '105-25',
      '106-25',
    ];

    getCaseDeadlinesByConsolidatedCaseDeadlineId.mockResolvedValue(
      TEST_DOCKET_NUMBER.map(dn => ({ docketNumber: dn })),
    );

    getCasesByDocketNumbers.mockResolvedValue(
      TEST_DOCKET_NUMBER.filter(dn => dn !== '106-25').map(
        dn =>
          ({
            docketNumber: dn,
            caseCaption: `${dn} - TEST_CAPTION`,
          }) as RawCase,
      ),
    );

    const results = await getConsolidatedCaseDeadlinesInteractor(
      {
        consolidatedCaseDeadlineId: TEST_CONSOLIDATED_DEADLINE_ID,
      },
      mockDocketClerkUser,
    );

    expect(results.length).toEqual(5);
    expect(results).toEqual([
      { docketNumber: '101-25', caseCaption: '101-25 - TEST_CAPTION' },
      { docketNumber: '102-25', caseCaption: '102-25 - TEST_CAPTION' },
      { docketNumber: '103-25', caseCaption: '103-25 - TEST_CAPTION' },
      { docketNumber: '104-25', caseCaption: '104-25 - TEST_CAPTION' },
      { docketNumber: '105-25', caseCaption: '105-25 - TEST_CAPTION' },
    ]);
  });
});
