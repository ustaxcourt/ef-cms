jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId',
);
jest.mock('@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber');
import { getConsolidatedCaseDeadlinesInteractor } from '@shared/business/useCases/getConsolidatedCaseDeadlinesInteractor';
import { getUniqueId } from '@shared/sharedAppContext';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCaseDeadlinesByConsolidatedCaseDeadlineId as getCaseDeadlinesByConsolidatedCaseDeadlineIdMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId';
import { getCaseMetadataByDocketNumber as getCaseMetadataByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber';

const getCaseDeadlinesByConsolidatedCaseDeadlineId =
  getCaseDeadlinesByConsolidatedCaseDeadlineIdMock as jest.Mock;

const getCaseMetadataByDocketNumber =
  getCaseMetadataByDocketNumberMock as jest.Mock;

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
    getCaseDeadlinesByConsolidatedCaseDeadlineId.mockResolvedValue([
      { docketNumber: '101-25' },
      { docketNumber: '102-25' },
      { docketNumber: '103-25' },
      { docketNumber: '104-25' },
      { docketNumber: '105-25' },
      { docketNumber: '106-25' },
    ]);

    getCaseMetadataByDocketNumber.mockImplementation(({ docketNumber }) => {
      if (docketNumber === '106-25') return undefined;
      return { caseCaption: `${docketNumber} - TEST_CAPTION` };
    });

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
