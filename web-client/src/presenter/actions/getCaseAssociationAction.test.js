import { User } from '../../../../shared/src/business/entities/User';
import { getCaseAssociationAction } from './getCaseAssociationAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { applicationContextForClient } from '../../../../shared/src/business/test/createTestApplicationContext';

describe('getCaseAssociation', () => {
  let verifyPendingCaseForUserInteractor;
  let applicationContext;

  beforeEach(() => {
    applicationContext = applicationContextForClient;
    presenter.providers.applicationContext = applicationContext;

    verifyPendingCaseForUserInteractor = applicationContext.getUseCases()
      .verifyPendingCaseForUserInteractor;

    verifyPendingCaseForUserInteractor.mockReturnValue(false);

    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.privatePractitioner,
      userId: '123',
    });
  });

  it('should return that practitioner is associated', async () => {
    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          privatePractitioners: [{ userId: '123' }],
        },
      },
    });
    expect(results.output).toEqual({
      isAssociated: true,
      pendingAssociation: false,
    });
  });

  it('should return that practitioner has pending association', async () => {
    verifyPendingCaseForUserInteractor.mockReturnValue(true);
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.privatePractitioner,
      userId: '1234',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          privatePractitioners: [{ userId: '123' }],
        },
      },
    });
    expect(results.output).toEqual({
      isAssociated: false,
      pendingAssociation: true,
    });
  });

  it('should return that practitioner not associated', async () => {
    verifyPendingCaseForUserInteractor.mockReturnValue(false);
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.privatePractitioner,
      userId: '1234',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          privatePractitioners: [{ userId: '123' }],
        },
      },
    });
    expect(results.output).toEqual({
      isAssociated: false,
      pendingAssociation: false,
    });
  });

  it('should return that respondent is associated', async () => {
    verifyPendingCaseForUserInteractor.mockReturnValue(false);
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.irsPractitioner,
      userId: '789',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          irsPractitioners: [{ userId: '789' }],
        },
      },
    });
    expect(results.output).toEqual({
      isAssociated: true,
      pendingAssociation: false,
    });
  });

  it('should return that respondent is not associated', async () => {
    verifyPendingCaseForUserInteractor.mockReturnValue(true);
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.irsPractitioner,
      userId: '789',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          irsPractitioners: [{ userId: '123' }],
        },
      },
    });
    expect(results.output).toEqual({
      isAssociated: false,
      pendingAssociation: false,
    });
  });

  it('should return that petitioner is associated', async () => {
    verifyPendingCaseForUserInteractor.mockReturnValue(false);
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitioner,
      userId: '123',
    });
    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          userId: '123',
        },
      },
    });
    expect(results.output).toEqual({
      isAssociated: true,
      pendingAssociation: false,
    });
  });

  it('should return that petitioner is not associated', async () => {
    verifyPendingCaseForUserInteractor.mockReturnValue(true);
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitioner,
      userId: '789',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          userId: '123',
        },
      },
    });
    expect(results.output).toEqual({
      isAssociated: false,
      pendingAssociation: false,
    });
  });

  it('should return false for isAssociated and pendingAssociation if the user is not an external user', async () => {
    verifyPendingCaseForUserInteractor.mockReturnValue(false);
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: '123',
    });

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          privatePractitioners: [{ userId: '123' }],
        },
      },
    });
    expect(results.output).toEqual({
      isAssociated: false,
      pendingAssociation: false,
    });
  });
});
