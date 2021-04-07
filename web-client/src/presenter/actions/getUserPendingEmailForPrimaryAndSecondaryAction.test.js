import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getUserPendingEmailForPrimaryAndSecondaryAction } from './getUserPendingEmailForPrimaryAndSecondaryAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getUserPendingEmailForPrimaryAndSecondaryAction', () => {
  const mockUserId = 'e14762ee-fc2f-4a9e-ba2c-2160469d2d04';
  const mockSecondaryUserId = 'c5c4b6e0-a889-4a05-a4f6-0fc2611d8740';
  const mockEmail = 'test@example.com';
  const mockSecondaryEmail = 'test2@example.com';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should make a call to getUserPendingEmailInteractor with state.caseDetail.petitioners[0].contactId', async () => {
    await runAction(getUserPendingEmailForPrimaryAndSecondaryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          petitioners: [
            { contactId: mockUserId, contactType: CONTACT_TYPES.primary },
          ],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getUserPendingEmailInteractor.mock
        .calls[0][0].userId,
    ).toBe(mockUserId);
  });

  it('should make a call to getUserPendingEmailInteractor with state.caseDetail.petitioners[1].contactId', async () => {
    await runAction(getUserPendingEmailForPrimaryAndSecondaryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          petitioners: [
            { contactId: mockUserId, contactType: CONTACT_TYPES.primary },
            {
              contactId: mockSecondaryUserId,
              contactType: CONTACT_TYPES.secondary,
            },
          ],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getUserPendingEmailInteractor.mock
        .calls[1][0].userId,
    ).toBe(mockSecondaryUserId);
  });

  it('should return contactPrimaryPendingEmail as props', async () => {
    applicationContext
      .getUseCases()
      .getUserPendingEmailInteractor.mockReturnValue(mockEmail);

    const { output } = await runAction(
      getUserPendingEmailForPrimaryAndSecondaryAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            petitioners: [
              { contactId: mockUserId, contactType: CONTACT_TYPES.primary },
            ],
          },
        },
      },
    );

    expect(output.contactPrimaryPendingEmail).toBe(mockEmail);
  });

  it('should return contactSecondaryPendingEmail as props if one is returned from the use case', async () => {
    applicationContext
      .getUseCases()
      .getUserPendingEmailInteractor.mockReturnValueOnce(mockEmail)
      .mockReturnValueOnce(mockSecondaryEmail);

    const { output } = await runAction(
      getUserPendingEmailForPrimaryAndSecondaryAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            petitioners: [
              { contactId: mockUserId, contactType: CONTACT_TYPES.primary },
              {
                contactId: mockSecondaryUserId,
                contactType: CONTACT_TYPES.secondary,
              },
            ],
          },
        },
      },
    );

    expect(output.contactPrimaryPendingEmail).toBe(mockEmail);
    expect(output.contactSecondaryPendingEmail).toBe(mockSecondaryEmail);
  });

  it('should return undefined for props.contactPrimaryPendingEmail when one is not returned from the use case', async () => {
    applicationContext
      .getUseCases()
      .getUserPendingEmailInteractor.mockReturnValue(undefined);

    const { output } = await runAction(
      getUserPendingEmailForPrimaryAndSecondaryAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            petitioners: [
              { contactId: mockUserId, contactType: CONTACT_TYPES.primary },
            ],
          },
        },
      },
    );

    expect(output.contactPrimaryPendingEmail).toBeUndefined();
  });
});
