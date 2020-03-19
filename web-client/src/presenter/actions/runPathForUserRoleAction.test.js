import { User } from '../../../../shared/src/business/entities/User';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { runPathForUserRoleAction } from './runPathForUserRoleAction';
import sinon from 'sinon';

let petitionerStub;
let privatePractitionerStub;
let irsPractitionerStub;
let petitionsclerkStub;
let docketclerkStub;
let judgeStub;
let otherInternalUserStub;

presenter.providers.applicationContext = {
  getUtilities: () => ({
    isExternalUser: User.isExternalUser,
    isInternalUser: User.isInternalUser,
  }),
};

describe('runPathForUserRoleAction', () => {
  beforeEach(() => {
    petitionerStub = sinon.stub();
    privatePractitionerStub = sinon.stub();
    irsPractitionerStub = sinon.stub();
    petitionsclerkStub = sinon.stub();
    docketclerkStub = sinon.stub();
    judgeStub = sinon.stub();
    otherInternalUserStub = sinon.stub();

    presenter.providers.path = {
      docketclerk: docketclerkStub,
      irsPractitioner: irsPractitionerStub,
      judge: judgeStub,
      otherInternalUser: otherInternalUserStub,
      petitioner: petitionerStub,
      petitionsclerk: petitionsclerkStub,
      privatePractitioner: privatePractitionerStub,
    };
  });

  it('should return the petitioner path for user role petitioner', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => ({
      role: User.ROLES.petitioner,
    });
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(petitionerStub.calledOnce).toEqual(true);
  });

  it('should return the privatePractitioner path for user role privatePractitioner', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => ({
      role: User.ROLES.privatePractitioner,
    });
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(privatePractitionerStub.calledOnce).toEqual(true);
  });

  it('should return the irsPractitioner path for user role irsPractitioner', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => ({
      role: User.ROLES.irsPractitioner,
    });
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(irsPractitionerStub.calledOnce).toEqual(true);
  });

  it('should return the petitionsclerk path for user role petitionsclerk', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => ({
      role: User.ROLES.petitionsClerk,
    });
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(petitionsclerkStub.calledOnce).toEqual(true);
  });

  it('should return the docketclerk path for user role docketclerk', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => ({
      role: User.ROLES.docketClerk,
    });
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(docketclerkStub.calledOnce).toEqual(true);
  });

  it('should return the judge path for user role judge', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => ({
      role: User.ROLES.judge,
    });
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {},
    });
    expect(judgeStub.calledOnce).toEqual(true);
  });
});
