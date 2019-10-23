import { getUserRoleAction } from './getUserRoleAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';
import { User } from '../../../../shared/src/business/entities/User';

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

describe('getUserRoleAction', () => {
  beforeEach(() => {
    petitionerStub = sinon.stub();
    practitionerStub = sinon.stub();
    respondentStub = sinon.stub();
    petitionsclerkStub = sinon.stub();
    docketclerkStub = sinon.stub();
    judgeStub = sinon.stub();
    otherInternalUserStub = sinon.stub();

    presenter.providers.path = {
      petitioner: petitionerStub,
      practitioner: practitionerStub,
      respondent: respondentStub,
      petitionsclerk: petitionsclerkStub,
      docketclerk: docketclerkStub,
      judge: judgeStub,
      otherInternalUser: otherInternalUserStub,
    };
  });

  it('should return the petitioner path for user role petitioner', async () => {
    await runAction(getUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        user: { role: User.ROLES.petitioner },
        constants: { USER_ROLES: User.ROLES },
      },
    });
    expect(petitionerStub.calledOnce).toEqual(true);
  });

  it('should return the practitioner path for user role practitioner', async () => {
    await runAction(getUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        user: { role: User.ROLES.practitioner },
        constants: { USER_ROLES: User.ROLES },
      },
    });
    expect(practitionerStub.calledOnce).toEqual(true);
  });

  it('should return the respondent path for user role respondent', async () => {
    await runAction(getUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        user: { role: User.ROLES.respondent },
        constants: { USER_ROLES: User.ROLES },
      },
    });
    expect(respondentStub.calledOnce).toEqual(true);
  });

  it('should return the petitionsclerk path for user role petitionsclerk', async () => {
    await runAction(getUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        user: { role: User.ROLES.petitionsClerk },
        constants: { USER_ROLES: User.ROLES },
      },
    });
    expect(petitionsclerkStub.calledOnce).toEqual(true);
  });

  it('should return the docketclerk path for user role docketclerk', async () => {
    await runAction(getUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        user: { role: User.ROLES.docketClerk },
        constants: { USER_ROLES: User.ROLES },
      },
    });
    expect(docketclerkStub.calledOnce).toEqual(true);
  });

  it('should return the judge path for user role judge', async () => {
    await runAction(getUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        user: { role: User.ROLES.judge },
        constants: { USER_ROLES: User.ROLES },
      },
    });
    expect(judgeStub.calledOnce).toEqual(true);
  });

  it('should return the otherInternalUser path for other internal user type', async () => {
    await runAction(getUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        user: { role: User.ROLES.adc },
        constants: { USER_ROLES: User.ROLES },
      },
    });
    expect(otherInternalUserStub.calledOnce).toEqual(true);
  });

  it('should not call otherInternalUser path if the user is an unrecognized role', async () => {
    await runAction(getUserRoleAction, {
      modules: {
        presenter,
      },
      state: {
        user: { role: 'somethingelse' },
        constants: { USER_ROLES: User.ROLES },
      },
    });
    expect(otherInternalUserStub.calledOnce).toEqual(false);
  });
});
