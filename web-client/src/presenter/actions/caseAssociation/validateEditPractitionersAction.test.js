import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateEditPractitionersAction } from './validateEditPractitionersAction';
import sinon from 'sinon';

describe('validateEditPractitionersAction', () => {
  let validateEditPractitionerInteractorStub;
  let successStub;
  let errorStub;

  beforeEach(() => {
    validateEditPractitionerInteractorStub = sinon.stub();
    successStub = sinon.stub();
    errorStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateEditPractitionerInteractor: validateEditPractitionerInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the path success when no errors are found', async () => {
    validateEditPractitionerInteractorStub.returns(null);
    await runAction(validateEditPractitionersAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          practitioners: [
            { representingPrimary: true, userId: '1' },
            { representingPrimary: true, userId: '2' },
          ],
        },
      },
    });

    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the path error when any errors are found', async () => {
    validateEditPractitionerInteractorStub.returns('error');
    await runAction(validateEditPractitionersAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          practitioners: [
            { userId: '1' },
            { representingPrimary: true, userId: '2' },
          ],
        },
      },
    });

    expect(errorStub.calledOnce).toEqual(true);
    expect(errorStub.getCall(0).args[0].errors).toEqual({
      practitioners: ['error', 'error'],
    });
  });
});
