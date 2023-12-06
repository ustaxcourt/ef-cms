import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getPendingEmailsOnCaseAction } from './getPendingEmailsOnCaseAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPendingEmailsOnCaseAction', () => {
  const mockUserId = 'e14762ee-fc2f-4a9e-ba2c-2160469d2d04';
  const mockSecondUserId = 'c5c4b6e0-a889-4a05-a4f6-0fc2611d8740';
  const mockThirdUserId = 'd89ffd98-8635-40f3-92cc-35de3c557420';
  const mockFourthUserId = 'fa15af65-7082-491d-92d0-e3c95b4cd2da';
  const mockEmail = 'test@example.com';
  const mockSecondaryEmail = 'test2@example.com';
  const mockTertiaryEmail = 'test3@example.com';
  const mockQuadrilateralEmail = 'test4@example.com';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should make calls to getUsersPendingEmailInteractor with the contactId of each petitioner and practitioner on the case', async () => {
    await runAction(getPendingEmailsOnCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          irsPractitioners: [{ userId: mockThirdUserId }],
          petitioners: [
            { contactId: mockUserId },
            { contactId: mockSecondUserId },
          ],
          privatePractitioners: [{ userId: mockFourthUserId }],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getUsersPendingEmailInteractor.mock
        .calls[0][1].userIds,
    ).toEqual([
      mockUserId,
      mockSecondUserId,
      mockThirdUserId,
      mockFourthUserId,
    ]);
  });

  it('should NOT make calls to getUsersPendingEmailInteractor if no userIds are found in the case detail', async () => {
    const result = await runAction(getPendingEmailsOnCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
      },
    });

    expect(
      applicationContext.getUseCases().getUsersPendingEmailInteractor,
    ).not.toHaveBeenCalled();

    expect(result.output).toEqual({ pendingEmails: {} });
  });

  it('should return pendingEmails as props', async () => {
    applicationContext
      .getUseCases()
      .getUsersPendingEmailInteractor.mockReturnValueOnce({
        [mockFourthUserId]: mockQuadrilateralEmail,
        [mockSecondUserId]: mockSecondaryEmail,
        [mockThirdUserId]: mockTertiaryEmail,
        [mockUserId]: mockEmail,
      });

    const { output } = await runAction(getPendingEmailsOnCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          irsPractitioners: [{ userId: mockThirdUserId }],
          petitioners: [
            { contactId: mockUserId },
            { contactId: mockSecondUserId },
          ],
          privatePractitioners: [{ userId: mockFourthUserId }],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getUsersPendingEmailInteractor.mock
        .calls[0][1].userIds,
    ).toEqual([
      mockUserId,
      mockSecondUserId,
      mockThirdUserId,
      mockFourthUserId,
    ]);
    expect(output.pendingEmails).toEqual({
      [mockFourthUserId]: mockQuadrilateralEmail,
      [mockSecondUserId]: mockSecondaryEmail,
      [mockThirdUserId]: mockTertiaryEmail,
      [mockUserId]: mockEmail,
    });
  });
});
