import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { mockPetitionsClerkUser } from '@shared/test/mockAuthUsers';
import { updateCaseDeadlineInteractor } from './updateCaseDeadlineInteractor';

describe('updateCaseDeadlineInteractor', () => {
  const CASE_DEADLINE_ID = '6805d1ab-18d0-43ec-bafb-654e83405416';

  const mockCaseDeadline = {
    associatedJudge: 'Buch',
    associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
    caseDeadlineId: CASE_DEADLINE_ID,
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
    docketNumber: '123-20',
  } as any;

  it('throws an error if the user is not valid or authorized', async () => {
    await expect(
      updateCaseDeadlineInteractor(
        applicationContext,
        {
          caseDeadline: mockCaseDeadline,
        },
        {} as UnknownAuthUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('updates a case deadline', async () => {
    applicationContext.environment.stage = 'local';

    const caseDeadline = await updateCaseDeadlineInteractor(
      applicationContext,
      {
        caseDeadline: mockCaseDeadline,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().deleteCaseDeadline.mock
        .calls[0][0],
    ).toMatchObject({
      caseDeadlineId: CASE_DEADLINE_ID,
      docketNumber: '123-20',
    });
    expect(
      applicationContext.getPersistenceGateway().createCaseDeadline.mock
        .calls[0][0],
    ).toMatchObject({
      caseDeadline: mockCaseDeadline,
    });
    expect(caseDeadline).toBeDefined();
  });
});
