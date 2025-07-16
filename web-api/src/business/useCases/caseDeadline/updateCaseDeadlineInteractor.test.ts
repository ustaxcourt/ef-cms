import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';
import { updateCaseDeadlineInteractor } from './updateCaseDeadlineInteractor';
import { upsertCaseDeadlines as upsertCaseDeadlinesMock } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';

const upsertCaseDeadlines = upsertCaseDeadlinesMock as jest.Mock;

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
});
