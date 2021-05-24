import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getPetitionersPendingEmailStatusOnCaseAction } from './getPetitionersPendingEmailStatusOnCaseAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getPetitionersPendingEmailStatusOnCaseAction', () => {
  const mockUserId = 'e14762ee-fc2f-4a9e-ba2c-2160469d2d04';
  const mockSecondUserId = 'c5c4b6e0-a889-4a05-a4f6-0fc2611d8740';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should make calls to getUsersPendingEmailStatusesInteractor with the contactId of each petitioner on the case', async () => {
    await runAction(getPetitionersPendingEmailStatusOnCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          petitioners: [
            { contactId: mockUserId },
            { contactId: mockSecondUserId },
          ],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getUsersPendingEmailStatusesInteractor
        .mock.calls[0][0].userIds,
    ).toEqual([mockUserId, mockSecondUserId]);
  });

  it('should return pendingEmails as props', async () => {
    applicationContext
      .getUseCases()
      .getUsersPendingEmailStatusesInteractor.mockReturnValueOnce({
        [mockSecondUserId]: false,
        [mockUserId]: true,
      });

    const { output } = await runAction(
      getPetitionersPendingEmailStatusOnCaseAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            petitioners: [
              { contactId: mockUserId },
              { contactId: mockSecondUserId },
            ],
          },
        },
      },
    );

    expect(
      applicationContext.getUseCases().getUsersPendingEmailStatusesInteractor
        .mock.calls[0][0].userIds,
    ).toEqual([mockUserId, mockSecondUserId]);
    expect(output.pendingEmails).toEqual({
      [mockSecondUserId]: false,
      [mockUserId]: true,
    });
  });
});
