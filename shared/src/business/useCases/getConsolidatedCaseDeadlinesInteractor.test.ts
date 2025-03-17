jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId',
);
jest.mock('@web-api/persistence/postgres/cases/getCaseByDocketNumber');
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getConsolidatedCaseDeadlinesInteractor } from '@shared/business/useCases/getConsolidatedCaseDeadlinesInteractor';
import { getUniqueId } from '@shared/sharedAppContext';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCaseDeadlinesByConsolidatedCaseDeadlineId as getCaseDeadlinesByConsolidatedCaseDeadlineIdMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId';
import { getCaseByDocketNumberPostgres as getCaseByDocketNumberPostgresMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

const getCaseDeadlinesByConsolidatedCaseDeadlineId =
  getCaseDeadlinesByConsolidatedCaseDeadlineIdMock as jest.Mock;

const getCaseByDocketNumberPostgres =
  getCaseByDocketNumberPostgresMock as jest.Mock;

describe('getConsolidatedCaseDeadlinesInteractor', () => {
  const TEST_CONSOLIDATED_DEADLINE_ID = getUniqueId();

  it('should throw an "Unauthorized" error when the provided user does not have permissions', async () => {
    await expect(
      getConsolidatedCaseDeadlinesInteractor(
        applicationContext,
        {
          consolidatedCaseDeadlineId: TEST_CONSOLIDATED_DEADLINE_ID,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return no itesm if there are new consolidated case deadlines', async () => {
    getCaseDeadlinesByConsolidatedCaseDeadlineId.mockResolvedValue([]);

    const results = await getConsolidatedCaseDeadlinesInteractor(
      applicationContext,
      {
        consolidatedCaseDeadlineId: TEST_CONSOLIDATED_DEADLINE_ID,
      },
      mockDocketClerkUser,
    );

    expect(results.length).toEqual(0);
  });

  it('should return all the itesm if there are new consolidated case deadlines', async () => {
    getCaseDeadlinesByConsolidatedCaseDeadlineId.mockResolvedValue([
      { docketNumber: '101-25' },
      { docketNumber: '102-25' },
      { docketNumber: '103-25' },
      { docketNumber: '104-25' },
      { docketNumber: '105-25' },
      { docketNumber: '106-25' },
    ]);

    getCaseByDocketNumberPostgres.mockImplementation(docketNumber => {
      if (docketNumber === '106-25') return [];
      return [{ caption: `${docketNumber} - TEST_CAPTION` }];
    });

    const results = await getConsolidatedCaseDeadlinesInteractor(
      applicationContext,
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
