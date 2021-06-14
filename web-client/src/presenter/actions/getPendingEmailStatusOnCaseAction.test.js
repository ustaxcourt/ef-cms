import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getPendingEmailStatusOnCaseAction } from './getPendingEmailStatusOnCaseAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getPendingEmailStatusOnCaseAction', () => {
  const mockUserId = 'e14762ee-fc2f-4a9e-ba2c-2160469d2d04';
  const mockSecondUserId = 'c5c4b6e0-a889-4a05-a4f6-0fc2611d8740';

  const privatePractitioner1 = 'c5c4b6e0-a889-4a05-a4f6-0fc2611d8741';
  const privatePractitioner2 = 'c5c4b6e0-a889-4a05-a4f6-0fc2611d8742';

  const irsPractitioner1 = 'c5c4b6e0-a889-4a05-a4f6-0fc2611d8751';
  const irsPractitioner2 = 'c5c4b6e0-a889-4a05-a4f6-0fc2611d8752';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should make calls to getUsersPendingEmailStatusesInteractor with the contactId of each petitioner on the case', async () => {
    await runAction(getPendingEmailStatusOnCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          irsPractitioners: [
            { userId: irsPractitioner1 },
            { userId: irsPractitioner2 },
          ],
          petitioners: [
            { contactId: mockUserId },
            { contactId: mockSecondUserId },
          ],
          privatePractitioners: [
            { userId: privatePractitioner1 },
            { userId: privatePractitioner2 },
          ],
        },
      },
    });

    const userIdsArgument = applicationContext.getUseCases()
      .getUsersPendingEmailStatusesInteractor.mock.calls[0][1].userIds;
    expect(userIdsArgument).toEqual(
      expect.arrayContaining([
        mockUserId,
        mockSecondUserId,
        privatePractitioner1,
        privatePractitioner2,
        irsPractitioner1,
        irsPractitioner2,
      ]),
    );
  });

  it('should return pendingEmails as props', async () => {
    const returnValue = {
      [irsPractitioner1]: false,
      [irsPractitioner2]: true,
      [mockSecondUserId]: false,
      [mockUserId]: true,
      [privatePractitioner1]: false,
      [privatePractitioner2]: true,
    };
    applicationContext
      .getUseCases()
      .getUsersPendingEmailStatusesInteractor.mockReturnValueOnce(returnValue);

    const { output } = await runAction(getPendingEmailStatusOnCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          irsPractitioners: [
            { userId: irsPractitioner1 },
            { userId: irsPractitioner2 },
          ],
          petitioners: [
            { contactId: mockUserId },
            { contactId: mockSecondUserId },
          ],
          privatePractitioners: [
            { userId: privatePractitioner1 },
            { userId: privatePractitioner2 },
          ],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getUsersPendingEmailStatusesInteractor
        .mock.calls[0][1].userIds,
    ).toEqual(expect.arrayContaining(Object.keys(returnValue)));
    expect(output.pendingEmails).toEqual(returnValue);
  });
});
