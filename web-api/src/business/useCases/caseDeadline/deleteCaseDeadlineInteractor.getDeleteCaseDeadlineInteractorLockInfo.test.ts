import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId',
);
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getUniqueId } from '@shared/sharedAppContext';
import { getDeleteCaseDeadlineInteractorLockInfo } from '@web-api/business/useCases/caseDeadline/deleteCaseDeadlineInteractor';
import { getCaseDeadlinesByConsolidatedCaseDeadlineId as getCaseDeadlinesByConsolidatedCaseDeadlineIdMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId';

const getCaseDeadlinesByConsolidatedCaseDeadlineId =
  getCaseDeadlinesByConsolidatedCaseDeadlineIdMock as jest.Mock;

describe('deleteCaseDeadlineInteractor - getDeleteCaseDeadlineInteractorLockInfo', () => {
  const TEST_DEADLINE_ID = getUniqueId();
  const TEST_DOCKET_NUMBER = '101-25';

  it('should return only the main case when there are no consolidated case deadlines', async () => {
    getCaseDeadlinesByConsolidatedCaseDeadlineId.mockReturnValue([]);

    const { identifiers } = await getDeleteCaseDeadlineInteractorLockInfo(
      applicationContext,
      {
        caseDeadlineId: TEST_DEADLINE_ID,
        docketNumber: TEST_DOCKET_NUMBER,
      },
    );

    expect(identifiers.length).toEqual(1);
    expect(identifiers[0]).toEqual(`case|${TEST_DOCKET_NUMBER}`);
  });

  it('should return all the identities for cases in a consolidated group that contain deadline', async () => {
    getCaseDeadlinesByConsolidatedCaseDeadlineId.mockReturnValue([
      { docketNumber: TEST_DOCKET_NUMBER },
      { docketNumber: '102-25' },
      { docketNumber: '103-25' },
      { docketNumber: '104-25' },
    ]);

    const { identifiers } = await getDeleteCaseDeadlineInteractorLockInfo(
      applicationContext,
      {
        caseDeadlineId: TEST_DEADLINE_ID,
        docketNumber: TEST_DOCKET_NUMBER,
      },
    );

    expect(identifiers.length).toEqual(4);
    expect(identifiers[0]).toEqual(`case|${TEST_DOCKET_NUMBER}`);
    expect(identifiers[1]).toEqual(`case|102-25`);
    expect(identifiers[2]).toEqual(`case|103-25`);
    expect(identifiers[3]).toEqual(`case|104-25`);
  });
});
