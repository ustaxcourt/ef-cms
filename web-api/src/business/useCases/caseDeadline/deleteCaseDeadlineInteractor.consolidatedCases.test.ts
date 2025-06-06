import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId',
);
jest.mock('@web-api/persistence/postgres/caseDeadlines/deleteCaseDeadline');
jest.mock('@web-api/persistence/postgres/cases/getCaseByDocketNumber');
jest.mock(
  '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock',
);
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getUniqueId } from '@shared/sharedAppContext';
import { deleteCaseDeadline } from '@web-api/business/useCases/caseDeadline/deleteCaseDeadlineInteractor';
import { getCaseDeadlinesByConsolidatedCaseDeadlineId as getCaseDeadlinesByConsolidatedCaseDeadlineIdMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';
import { MOCK_CASE } from '@shared/test/mockCase';
import { deleteCaseDeadline as deleteDeadlineMock } from '@web-api/persistence/postgres/caseDeadlines/deleteCaseDeadline';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAutomaticBlock as updateCaseAutomaticBlockMock } from '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock';

const getCaseDeadlinesByConsolidatedCaseDeadlineId =
  getCaseDeadlinesByConsolidatedCaseDeadlineIdMock as jest.Mock;

const deleteDeadline = deleteDeadlineMock as jest.Mock;

const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
const updateCaseAutomaticBlock = jest.mocked(updateCaseAutomaticBlockMock);

describe('deleteCaseDeadlineInteractor - Consolidated Cases', () => {
  const TEST_DEADLINE_ID = getUniqueId();
  const TEST_DOCKET_NUMBER = '101-25';

  beforeEach(() => {
    updateCaseAutomaticBlock.mockImplementation(
      // eslint-disable-next-line @typescript-eslint/require-await
      async params => params.caseEntity,
    );
  });

  it('should only delete one deadline when the case is not the lead case of the Consolidated Group', async () => {
    const CONSOLIDATED_CASE_DEADLINE_IDS = [
      getUniqueId(),
      getUniqueId(),
      getUniqueId(),
    ];

    getCaseDeadlinesByConsolidatedCaseDeadlineId.mockReturnValue(
      CONSOLIDATED_CASE_DEADLINE_IDS.map((id, index) => {
        return {
          caseDeadlineId: id,
          docketNumber: `${102 + index}-25`,
        };
      }),
    );

    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      docketNumber: TEST_DOCKET_NUMBER,
      leadDocketNumber: undefined,
    });

    await deleteCaseDeadline(
      applicationContext,
      {
        caseDeadlineId: TEST_DEADLINE_ID,
        docketNumber: TEST_DOCKET_NUMBER,
      },
      mockPetitionsClerkUser,
    );

    const deleteDeadlineCalls = deleteDeadline.mock.calls;
    expect(deleteDeadlineCalls.length).toEqual(1);
    expect(deleteDeadlineCalls[0][0]).toEqual({
      caseDeadlineId: TEST_DEADLINE_ID,
    });
  });

  it('should delete all the deadline when the case is a lead case of the Consolidated Group', async () => {
    const CONSOLIDATED_CASE_DEADLINE_IDS = [
      getUniqueId(),
      getUniqueId(),
      getUniqueId(),
    ];

    getCaseDeadlinesByConsolidatedCaseDeadlineId.mockReturnValue(
      CONSOLIDATED_CASE_DEADLINE_IDS.map((id, index) => {
        return {
          caseDeadlineId: id,
          docketNumber: `${102 + index}-25`,
        };
      }),
    );

    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      docketNumber: TEST_DOCKET_NUMBER,
      leadDocketNumber: TEST_DOCKET_NUMBER,
    });

    await deleteCaseDeadline(
      applicationContext,
      {
        caseDeadlineId: TEST_DEADLINE_ID,
        docketNumber: TEST_DOCKET_NUMBER,
      },
      mockPetitionsClerkUser,
    );

    const deleteDeadlineCalls = deleteDeadline.mock.calls;
    expect(deleteDeadlineCalls.length).toEqual(4);
    expect(deleteDeadlineCalls[0][0]).toEqual({
      caseDeadlineId: TEST_DEADLINE_ID,
    });
    expect(deleteDeadlineCalls[1][0]).toEqual({
      caseDeadlineId: CONSOLIDATED_CASE_DEADLINE_IDS[0],
    });
    expect(deleteDeadlineCalls[2][0]).toEqual({
      caseDeadlineId: CONSOLIDATED_CASE_DEADLINE_IDS[1],
    });
    expect(deleteDeadlineCalls[3][0]).toEqual({
      caseDeadlineId: CONSOLIDATED_CASE_DEADLINE_IDS[2],
    });
  });

  it('should only delete one deadline when the case is the lead case of the Consolidated Group but the flag "handlingConsolidatedCases" is true', async () => {
    const CONSOLIDATED_CASE_DEADLINE_IDS = [
      getUniqueId(),
      getUniqueId(),
      getUniqueId(),
    ];

    getCaseDeadlinesByConsolidatedCaseDeadlineId.mockReturnValue(
      CONSOLIDATED_CASE_DEADLINE_IDS.map((id, index) => {
        return {
          caseDeadlineId: id,
          docketNumber: `${102 + index}-25`,
        };
      }),
    );

    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      docketNumber: TEST_DOCKET_NUMBER,
      leadDocketNumber: TEST_DOCKET_NUMBER,
    });

    await deleteCaseDeadline(
      applicationContext,
      {
        caseDeadlineId: TEST_DEADLINE_ID,
        docketNumber: TEST_DOCKET_NUMBER,
        handlingConsolidatedCases: true,
      },
      mockPetitionsClerkUser,
    );

    const deleteDeadlineCalls = deleteDeadline.mock.calls;
    expect(deleteDeadlineCalls.length).toEqual(1);
    expect(deleteDeadlineCalls[0][0]).toEqual({
      caseDeadlineId: TEST_DEADLINE_ID,
    });
  });
});
