import { getPrivatePractitionersBySearchKeyAction } from './getPrivatePractitionersBySearchKeyAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let getPrivatePractitionersBySearchKeyInteractorStub;

describe('getPrivatePractitionersBySearchKeyAction', () => {
  let successStub, errorStub;

  beforeEach(() => {
    successStub = sinon.stub();
    errorStub = sinon.stub();

    getPrivatePractitionersBySearchKeyInteractorStub = sinon.stub().resolves([
      {
        name: 'Test Practitioner',
        userId: '345',
      },
    ]);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getPrivatePractitionersBySearchKeyInteractor: getPrivatePractitionersBySearchKeyInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('calls the use case to get the matching privatePractitioners and calls the success path if privatePractitioners are returned', async () => {
    await runAction(getPrivatePractitionersBySearchKeyAction, {
      modules: {
        presenter,
      },
      state: { form: { practitionerSearch: 'Test Practitioner' } },
    });
    expect(getPrivatePractitionersBySearchKeyInteractorStub.calledOnce).toEqual(
      true,
    );
    expect(
      getPrivatePractitionersBySearchKeyInteractorStub.getCall(0).args[0]
        .searchKey,
    ).toEqual('Test Practitioner');
    expect(successStub.calledOnce).toEqual(true);
    expect(errorStub.calledOnce).toEqual(false);
  });

  it('calls the use case to get the matching privatePractitioners and calls the error path if no privatePractitioners are returned', async () => {
    getPrivatePractitionersBySearchKeyInteractorStub = sinon
      .stub()
      .resolves([]);

    await runAction(getPrivatePractitionersBySearchKeyAction, {
      modules: {
        presenter,
      },
      state: { form: { practitionerSearch: 'Test Practitioner2' } },
    });
    expect(getPrivatePractitionersBySearchKeyInteractorStub.calledOnce).toEqual(
      true,
    );
    expect(
      getPrivatePractitionersBySearchKeyInteractorStub.getCall(0).args[0]
        .searchKey,
    ).toEqual('Test Practitioner2');
    expect(successStub.calledOnce).toEqual(false);
    expect(errorStub.calledOnce).toEqual(true);
  });
});
