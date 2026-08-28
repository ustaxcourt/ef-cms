import {
  PRACTICE_TYPE,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { isUserDirectlyAssociatedToCaseAction } from '@web-client/presenter/actions/isUserDirectlyAssociatedToCaseAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { irsPractitionerUser } from '@shared/test/mockUsers';

describe('isUserDirectlyAssociatedToCase', () => {
  const pathYesStub = jest.fn();
  const pathNoStub = jest.fn();

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    yes: pathYesStub,
    no: pathNoStub,
  };

  it('should return no if the user is not directly associated', async () => {
    await runAction(isUserDirectlyAssociatedToCaseAction, {
      modules: {
        presenter,
      },
      props: {
        isDirectlyAssociated: false,
        caseDetail: {},
      },
      state: {
        user: {
          role: ROLES.petitioner,
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return no if no isDirectlyAssociated prop is found', async () => {
    await runAction(isUserDirectlyAssociatedToCaseAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          irsPractitioners: [irsPractitionerUser],
        },
      },
      state: {
        user: {
          role: ROLES.petitioner,
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return yes if the user is directly associated', async () => {
    await runAction(isUserDirectlyAssociatedToCaseAction, {
      modules: {
        presenter,
      },
      props: {
        isDirectlyAssociated: true,
        caseDetail: {
          irsPractitioners: [irsPractitionerUser],
        },
      },
      state: {
        user: {
          role: ROLES.irsPractitioner,
          practiceType: PRACTICE_TYPE.IRS,
        },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return yes if the user is an irs practitioner this is a first filing appearance', async () => {
    await runAction(isUserDirectlyAssociatedToCaseAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          irsPractitioners: [],
        },
      },
      state: {
        user: {
          role: ROLES.irsPractitioner,
          practiceType: PRACTICE_TYPE.IRS,
        },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return no if the user is an irs practitioner and the case already has representation', async () => {
    await runAction(isUserDirectlyAssociatedToCaseAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          irsPractitioners: [irsPractitionerUser],
        },
      },
      state: {
        user: {
          role: ROLES.irsPractitioner,
          practiceType: PRACTICE_TYPE.IRS,
        },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return yes if the user is an irs practitioner and is associated', async () => {
    await runAction(isUserDirectlyAssociatedToCaseAction, {
      modules: {
        presenter,
      },
      props: {
        isDirectlyAssociated: true,
        caseDetail: {
          irsPractitioners: [irsPractitionerUser],
        },
      },
      state: {
        user: {
          role: ROLES.irsPractitioner,
          practiceType: PRACTICE_TYPE.IRS,
        },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });
});
