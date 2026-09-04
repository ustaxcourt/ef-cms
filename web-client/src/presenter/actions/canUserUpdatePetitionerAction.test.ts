import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { canUserUpdatePetitionerAction } from '@web-client/presenter/actions/canUserUpdatePetitionerAction';
import {
  MOCK_CASE_WITH_SECONDARY_OTHERS,
  MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
} from '@shared/test/mockCase';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import {
  petitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';

describe('canUserUpdatePetitionerAction', () => {
  const pathYesStub = jest.fn();
  const pathNoStub = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    yes: pathYesStub,
    no: pathNoStub,
  };

  it('should return yes if the user has internal permissions to edit', async () => {
    await runAction(canUserUpdatePetitionerAction, {
      modules: {
        presenter,
      },
      props: {
        contactId: '1234567',
        caseDetail: MOCK_CASE_WITH_SECONDARY_OTHERS,
      },
      state: {
        user: mockDocketClerkUser,
      },
    });

    expect(pathYesStub).toHaveBeenCalledTimes(1);
    expect(pathNoStub).not.toHaveBeenCalled();
  });

  it('should return yes if user is on the case', async () => {
    await runAction(canUserUpdatePetitionerAction, {
      modules: {
        presenter,
      },
      props: {
        contactId: mockPetitionerUser.userId,
        caseDetail: {
          ...MOCK_CASE_WITH_SECONDARY_OTHERS,
          petitioners: [
            { ...mockPetitionerUser, contactId: mockPetitionerUser.userId },
          ],
        },
      },
      state: {
        user: mockPetitionerUser,
      },
    });

    expect(pathYesStub).toHaveBeenCalledTimes(1);
    expect(pathNoStub).not.toHaveBeenCalled();
  });

  it('should return yes if practitioner for a user on the case', async () => {
    await runAction(canUserUpdatePetitionerAction, {
      modules: {
        presenter,
      },
      props: {
        contactId: petitionerUser.userId,
        caseDetail: {
          ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
          petitioners: [petitionerUser],
          privatePractitioners: [
            {
              ...privatePractitionerUser,
              userId: mockPrivatePractitionerUser.userId,
              representing: [petitionerUser.userId],
            },
          ],
        },
      },
      state: {
        user: mockPrivatePractitionerUser,
      },
    });

    expect(pathYesStub).toHaveBeenCalledTimes(1);
    expect(pathNoStub).not.toHaveBeenCalled();
  });

  it('should return no if user is not on the case', async () => {
    await runAction(canUserUpdatePetitionerAction, {
      modules: {
        presenter,
      },
      props: {
        contactId: petitionerUser,
        caseDetail: {
          ...MOCK_CASE_WITH_SECONDARY_OTHERS,
          petitioners: [
            { ...mockPetitionerUser, contactId: mockPetitionerUser.userId },
          ],
        },
      },
      state: {
        user: mockPetitionerUser,
      },
    });

    expect(pathNoStub).toHaveBeenCalledTimes(1);
    expect(pathYesStub).not.toHaveBeenCalled();
  });
});
