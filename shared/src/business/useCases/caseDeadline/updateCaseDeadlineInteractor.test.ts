import { ROLES } from '../../entities/EntityConstants';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
import { updateCaseDeadlineInteractor } from './updateCaseDeadlineInteractor';

describe('updateCaseDeadlineInteractor', () => {
  const CASE_DEADLINE_ID = '6805d1ab-18d0-43ec-bafb-654e83405416';

  const mockCaseDeadline = {
    associatedJudge: 'Buch',
    caseDeadlineId: CASE_DEADLINE_ID,
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
    docketNumber: '123-20',
  } as any;

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateCaseDeadlineInteractor(applicationContext, {
        caseDeadline: mockCaseDeadline,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('updates a case deadline', async () => {
    const mockPetitionsClerk = new User({
      name: 'Test Petitionsclerk',
      role: ROLES.petitionsClerk,
      userId: '65370e00-f608-4118-980c-56b6c0fe8df5',
    });
    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockReturnValue(mockPetitionsClerk);

    const caseDeadline = await updateCaseDeadlineInteractor(
      applicationContext,
      {
        caseDeadline: mockCaseDeadline,
      },
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
