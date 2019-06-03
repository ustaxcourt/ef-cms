import { getCaseAssociationAction } from './getCaseAssociationAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('getCaseAssociation', () => {
  it('should return that practitioner is associated', async () => {
    let verifyPendingCaseForUserStub = sinon.stub().returns(false);
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        verifyPendingCaseForUser: verifyPendingCaseForUserStub,
      }),
    };

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          practitioners: [{ userId: '123' }],
        },
        user: {
          userId: '123',
        },
      },
    });
    expect(results.output).toEqual({ isAssociated: true });
  });

  it('should return that practitioner has pending association', async () => {
    let verifyPendingCaseForUserStub = sinon.stub().returns(true);
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        verifyPendingCaseForUser: verifyPendingCaseForUserStub,
      }),
    };

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          practitioners: [{ userId: '123' }],
        },
        user: {
          userId: '1234',
        },
      },
    });
    expect(results.output).toEqual({ pendingAssociation: true });
  });

  it('should return that practitioner not associated', async () => {
    let verifyPendingCaseForUserStub = sinon.stub().returns(false);
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        verifyPendingCaseForUser: verifyPendingCaseForUserStub,
      }),
    };

    const results = await runAction(getCaseAssociationAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          practitioners: [{ userId: '123' }],
        },
        user: {
          userId: '1234',
        },
      },
    });
    expect(results.output).toEqual({ notAssociated: true });
  });
});
