import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getPendingEmailsOnCaseAction } from './getPendingEmailsOnCaseAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

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

  it('should make calls to getUserPendingEmailInteractor with the contactId of each petitioner and practitioner on the case', async () => {
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
      applicationContext.getUseCases().getUserPendingEmailInteractor.mock
        .calls[0][0].userId,
    ).toBe(mockUserId);

    expect(
      applicationContext.getUseCases().getUserPendingEmailInteractor.mock
        .calls[1][0].userId,
    ).toBe(mockSecondUserId);

    expect(
      applicationContext.getUseCases().getUserPendingEmailInteractor.mock
        .calls[2][0].userId,
    ).toBe(mockThirdUserId);

    expect(
      applicationContext.getUseCases().getUserPendingEmailInteractor.mock
        .calls[3][0].userId,
    ).toBe(mockFourthUserId);
  });

  it('should return pendingEmails as props', async () => {
    applicationContext
      .getUseCases()
      .getUserPendingEmailInteractor.mockReturnValueOnce(mockEmail)
      .mockReturnValueOnce(mockSecondaryEmail)
      .mockReturnValueOnce(mockTertiaryEmail)
      .mockReturnValueOnce(mockQuadrilateralEmail);

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

    expect(output.pendingEmails).toEqual({
      [mockFourthUserId]: mockQuadrilateralEmail,
      [mockSecondUserId]: mockSecondaryEmail,
      [mockThirdUserId]: mockTertiaryEmail,
      [mockUserId]: mockEmail,
    });
  });
});
