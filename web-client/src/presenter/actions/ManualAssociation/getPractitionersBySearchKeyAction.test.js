import { getPractitionersBySearchKeyAction } from './getPractitionersBySearchKeyAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let getPractitionersBySearchKeyInteractorStub;

describe('getPractitionersBySearchKeyAction', () => {
  let successStub, errorStub;

  beforeEach(() => {
    successStub = sinon.stub();
    errorStub = sinon.stub();

    getPractitionersBySearchKeyInteractorStub = sinon.stub().resolves([
      {
        name: 'Test Practitioner',
        userId: '345',
      },
    ]);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getPractitionersBySearchKeyInteractor: getPractitionersBySearchKeyInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('calls the use case to get the matching privatePractitioners and calls the success path if privatePractitioners are returned', async () => {
    await runAction(getPractitionersBySearchKeyAction, {
      modules: {
        presenter,
      },
      state: { form: { practitionerSearch: 'Test Practitioner' } },
    });
    expect(getPractitionersBySearchKeyInteractorStub.calledOnce).toEqual(true);
    expect(
      getPractitionersBySearchKeyInteractorStub.getCall(0).args[0].searchKey,
    ).toEqual('Test Practitioner');
    expect(successStub.calledOnce).toEqual(true);
    expect(errorStub.calledOnce).toEqual(false);
  });

  it('calls the use case to get the matching privatePractitioners and calls the error path if no privatePractitioners are returned', async () => {
    getPractitionersBySearchKeyInteractorStub = sinon.stub().resolves([]);

    await runAction(getPractitionersBySearchKeyAction, {
      modules: {
        presenter,
      },
      state: { form: { practitionerSearch: 'Test Practitioner2' } },
    });
    expect(getPractitionersBySearchKeyInteractorStub.calledOnce).toEqual(true);
    expect(
      getPractitionersBySearchKeyInteractorStub.getCall(0).args[0].searchKey,
    ).toEqual('Test Practitioner2');
    expect(successStub.calledOnce).toEqual(false);
    expect(errorStub.calledOnce).toEqual(true);
  });
});
