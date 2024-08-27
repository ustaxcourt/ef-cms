import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { runPathForUserRoleAction } from './runPathForUserRoleAction';

let petitionerStub;
let privatePractitionerStub;
let irsPractitionerStub;
let petitionsclerkStub;
let docketclerkStub;
let judgeStub;
let otherInternalUserStub;

describe('runPathForUserRoleAction', () => {
  beforeAll(() => {
    petitionerStub = jest.fn();
    privatePractitionerStub = jest.fn();
    irsPractitionerStub = jest.fn();
    petitionsclerkStub = jest.fn();
    docketclerkStub = jest.fn();
    judgeStub = jest.fn();
    otherInternalUserStub = jest.fn();

    presenter.providers.path = {
      docketclerk: docketclerkStub,
      irsPractitioner: irsPractitionerStub,
      judge: judgeStub,
      otherInternalUser: otherInternalUserStub,
      petitioner: petitionerStub,
      petitionsclerk: petitionsclerkStub,
      privatePractitioner: privatePractitionerStub,
    };

    presenter.providers.applicationContext = applicationContext;
  });

  it('should throw an exception for unrecognized roles', async () => {
    await expect(
      runAction(runPathForUserRoleAction, {
        modules: {
          presenter,
        },
        state: {
          user: {
            role: 'bananas',
          },
        },
      }),
    ).rejects.toThrow();
  });

  it('should return the petitioner path for user role petitioner', async () => {
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          role: ROLES.petitioner,
        },
      },
    });
    expect(petitionerStub.mock.calls.length).toEqual(1);
  });

  it('should return the privatePractitioner path for user role privatePractitioner', async () => {
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          role: ROLES.privatePractitioner,
        },
      },
    });
    expect(privatePractitionerStub.mock.calls.length).toEqual(1);
  });

  it('should return the irsPractitioner path for user role irsPractitioner', async () => {
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          role: ROLES.irsPractitioner,
        },
      },
    });
    expect(irsPractitionerStub.mock.calls.length).toEqual(1);
  });

  it('should return the petitionsclerk path for user role petitionsclerk', async () => {
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          role: ROLES.petitionsClerk,
        },
      },
    });
    expect(petitionsclerkStub.mock.calls.length).toEqual(1);
  });

  it('should return the docketclerk path for user role docketclerk', async () => {
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          role: ROLES.docketClerk,
        },
      },
    });
    expect(docketclerkStub.mock.calls.length).toEqual(1);
  });

  it('should return the judge path for user role judge', async () => {
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          role: ROLES.judge,
        },
      },
    });
    expect(judgeStub.mock.calls.length).toEqual(1);
  });
});
