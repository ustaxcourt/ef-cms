import { getPrivatePractitionersBySearchKeyAction } from './getPrivatePractitionersBySearchKeyAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

let getPrivatePractitionersBySearchKeyInteractorStub;

describe('getPrivatePractitionersBySearchKeyAction', () => {
  let successStub, errorStub;

  beforeEach(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    getPrivatePractitionersBySearchKeyInteractorStub = jest
      .fn()
      .mockResolvedValue([
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
    expect(
      getPrivatePractitionersBySearchKeyInteractorStub.mock.calls.length,
    ).toEqual(1);
    expect(
      getPrivatePractitionersBySearchKeyInteractorStub.mock.calls[0][0]
        .searchKey,
    ).toEqual('Test Practitioner');
    expect(successStub.mock.calls.length).toEqual(1);
    expect(errorStub).not.toBeCalled();
  });

  it('calls the use case to get the matching privatePractitioners and calls the error path if no privatePractitioners are returned', async () => {
    getPrivatePractitionersBySearchKeyInteractorStub = jest
      .fn()
      .mockResolvedValue([]);

    await runAction(getPrivatePractitionersBySearchKeyAction, {
      modules: {
        presenter,
      },
      state: { form: { practitionerSearch: 'Test Practitioner2' } },
    });
    expect(
      getPrivatePractitionersBySearchKeyInteractorStub.mock.calls.length,
    ).toEqual(1);
    expect(
      getPrivatePractitionersBySearchKeyInteractorStub.mock.calls[0][0]
        .searchKey,
    ).toEqual('Test Practitioner2');
    expect(successStub).not.toBeCalled();
    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
