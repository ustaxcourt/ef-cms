import { associatePractitionerWithCaseAction } from './associatePractitionerWithCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('associatePractitionerWithCaseAction', () => {
  it('should run associatePractitionerWithCaseInteractor and success path', async () => {
    const successStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        associatePractitionerWithCaseInteractor: () =>
          'hello from associate practitioner with case',
      }),
    };

    presenter.providers.path = {
      success: successStub,
    };

    await runAction(associatePractitionerWithCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: 'sdsdfsd' },
        modal: {
          representingPrimary: true,
          representingSecondary: false,
          user: {
            userId: 'sdfsd',
          },
        },
      },
    });
    expect(successStub.calledOnce).toEqual(true);
  });
});
