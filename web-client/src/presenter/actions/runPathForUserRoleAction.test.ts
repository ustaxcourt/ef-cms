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
    presenter.providers.applicationContext.getCurrentUser = () => ({
      role: 'bananas',
    });
    await expect(
      runAction(runPathForUserRoleAction, {
        modules: {
          presenter,
        },
        state: {},
      }),
    ).rejects.toThrow();
  });

  it('should return the petitioner path for user role petitioner', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
    });
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(petitionerStub.mock.calls.length).toEqual(1);
  });

  it('should return the privatePractitioner path for user role privatePractitioner', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => ({
      role: ROLES.privatePractitioner,
    });
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(privatePractitionerStub.mock.calls.length).toEqual(1);
  });

  it('should return the irsPractitioner path for user role irsPractitioner', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => ({
      role: ROLES.irsPractitioner,
    });
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(irsPractitionerStub.mock.calls.length).toEqual(1);
  });

  it('should return the petitionsclerk path for user role petitionsclerk', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => ({
      role: ROLES.petitionsClerk,
    });
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(petitionsclerkStub.mock.calls.length).toEqual(1);
  });

  it('should return the docketclerk path for user role docketclerk', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => ({
      role: ROLES.docketClerk,
    });
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(docketclerkStub.mock.calls.length).toEqual(1);
  });

  it('should return the judge path for user role judge', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => ({
      role: ROLES.judge,
    });
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(judgeStub.mock.calls.length).toEqual(1);
  });
});
