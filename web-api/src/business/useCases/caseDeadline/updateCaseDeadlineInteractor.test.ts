import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId',
);
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';
import { updateCaseDeadlineInteractor } from './updateCaseDeadlineInteractor';
import { upsertCaseDeadlines as upsertCaseDeadlinesMock } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import { getCaseDeadlinesByConsolidatedCaseDeadlineId as getCaseDeadlinesByConsolidatedCaseDeadlineIdMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByConsolidatedCaseDeadlineId';

const upsertCaseDeadlines = upsertCaseDeadlinesMock as jest.Mock;
const getCaseDeadlinesByConsolidatedCaseDeadlineId =
  getCaseDeadlinesByConsolidatedCaseDeadlineIdMock as jest.Mock;

describe('updateCaseDeadlineInteractor', () => {
  const CASE_DEADLINE_ID = '6805d1ab-18d0-43ec-bafb-654e83405416';

  const mockCaseDeadline = new CaseDeadline({
    associatedJudge: 'Buch',
    associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
    caseDeadlineId: CASE_DEADLINE_ID,
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
    docketNumber: '123-20',
  });

  beforeEach(() => {
    getCaseDeadlinesByConsolidatedCaseDeadlineId.mockReturnValue([]);
  });

  it('throws an error if the user is not valid or authorized', async () => {
    await expect(
      updateCaseDeadlineInteractor(
        {
          caseDeadline: mockCaseDeadline,
        },
        {} as UnknownAuthUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('updates a case deadline', async () => {
    const caseDeadline = await updateCaseDeadlineInteractor(
      {
        caseDeadline: mockCaseDeadline,
      },
      mockPetitionsClerkUser,
    );

    expect(upsertCaseDeadlines.mock.calls[0][0]).toMatchObject([
      mockCaseDeadline,
    ]);
    expect(caseDeadline).toBeDefined();
  });

  describe('Consolidated Group', () => {
    it('should update all deadlines in a consolidated group', async () => {
      const LEAD_DOCKET_NUMBER = '101-25';
      const CHILD_DOCKET_NUMBER = '102-25';
      getCaseDeadlinesByConsolidatedCaseDeadlineId.mockReturnValue([
        {
          ...mockCaseDeadline,
          description: 'TEST_OLD_DESCRIPTION',
          deadlineDate: '1111-03-01T21:42:29.073Z',
          docketNumber: CHILD_DOCKET_NUMBER,
        },
      ]);

      await updateCaseDeadlineInteractor(
        {
          caseDeadline: {
            ...mockCaseDeadline,
            description: 'TEST_UPDATED_DESCRIPTION',
            deadlineDate: '9999-03-01T21:42:29.073Z',
            docketNumber: LEAD_DOCKET_NUMBER,
          } as CaseDeadline,
        },
        mockPetitionsClerkUser,
      );

      const getCaseDeadlinesByConsolidatedCaseDeadlineIdCalls =
        getCaseDeadlinesByConsolidatedCaseDeadlineId.mock.calls;

      expect(getCaseDeadlinesByConsolidatedCaseDeadlineIdCalls.length).toEqual(
        1,
      );
      expect(getCaseDeadlinesByConsolidatedCaseDeadlineIdCalls[0]).toEqual([
        mockCaseDeadline.caseDeadlineId,
        LEAD_DOCKET_NUMBER,
      ]);

      const upsertCaseDeadlinesCalls = upsertCaseDeadlines.mock.calls;
      expect(upsertCaseDeadlinesCalls[0][0].length).toEqual(2);
      expect(upsertCaseDeadlinesCalls[0][0]).toMatchObject([
        {
          docketNumber: LEAD_DOCKET_NUMBER,
          description: 'TEST_UPDATED_DESCRIPTION',
          deadlineDate: '9999-03-01T21:42:29.073Z',
        },
        {
          docketNumber: CHILD_DOCKET_NUMBER,
          description: 'TEST_UPDATED_DESCRIPTION',
          deadlineDate: '9999-03-01T21:42:29.073Z',
        },
      ]);
    });
  });
});
