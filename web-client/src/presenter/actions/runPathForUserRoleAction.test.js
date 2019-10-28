import { User } from '../../../../shared/src/business/entities/User';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { runPathForUserRoleAction } from './runPathForUserRoleAction';
import sinon from 'sinon';

let petitionerStub;
let practitionerStub;
let respondentStub;
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
    practitionerStub = sinon.stub();
    respondentStub = sinon.stub();
    petitionsclerkStub = sinon.stub();
    docketclerkStub = sinon.stub();
    judgeStub = sinon.stub();
    otherInternalUserStub = sinon.stub();

    presenter.providers.path = {
      docketclerk: docketclerkStub,
      judge: judgeStub,
      otherInternalUser: otherInternalUserStub,
      petitioner: petitionerStub,
      petitionsclerk: petitionsclerkStub,
      practitioner: practitionerStub,
      respondent: respondentStub,
    };
  });

  it('should return the petitioner path for user role petitioner', async () => {
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        constants: { USER_ROLES: User.ROLES },
        user: { role: User.ROLES.petitioner },
      },
    });
    expect(petitionerStub.calledOnce).toEqual(true);
  });

  it('should return the practitioner path for user role practitioner', async () => {
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        constants: { USER_ROLES: User.ROLES },
        user: { role: User.ROLES.practitioner },
      },
    });
    expect(practitionerStub.calledOnce).toEqual(true);
  });

  it('should return the respondent path for user role respondent', async () => {
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        constants: { USER_ROLES: User.ROLES },
        user: { role: User.ROLES.respondent },
      },
    });
    expect(respondentStub.calledOnce).toEqual(true);
  });

  it('should return the petitionsclerk path for user role petitionsclerk', async () => {
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        constants: { USER_ROLES: User.ROLES },
        user: { role: User.ROLES.petitionsClerk },
      },
    });
    expect(petitionsclerkStub.calledOnce).toEqual(true);
  });

  it('should return the docketclerk path for user role docketclerk', async () => {
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        constants: { USER_ROLES: User.ROLES },
        user: { role: User.ROLES.docketClerk },
      },
    });
    expect(docketclerkStub.calledOnce).toEqual(true);
  });

  it('should return the judge path for user role judge', async () => {
    await runAction(runPathForUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        constants: { USER_ROLES: User.ROLES },
        user: { role: User.ROLES.judge },
      },
    });
    expect(judgeStub.calledOnce).toEqual(true);
  });
});
