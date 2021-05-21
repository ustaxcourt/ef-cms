import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getPrivatePractitionersBySearchKeyAction } from './getPrivatePractitionersBySearchKeyAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('getPrivatePractitionersBySearchKeyAction', () => {
  let successStub, errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    applicationContext
      .getUseCases()
      .getPrivatePractitionersBySearchKeyInteractor.mockResolvedValue([
        {
          name: 'Test Practitioner',
          userId: '345',
        },
      ]);

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
      applicationContext.getUseCases()
        .getPrivatePractitionersBySearchKeyInteractor.mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases()
        .getPrivatePractitionersBySearchKeyInteractor.mock.calls[0][1]
        .searchKey,
    ).toEqual('Test Practitioner');
    expect(successStub.mock.calls.length).toEqual(1);
    expect(errorStub).not.toBeCalled();
  });

  it('calls the use case to get the matching privatePractitioners and calls the error path if no privatePractitioners are returned', async () => {
    applicationContext
      .getUseCases()
      .getPrivatePractitionersBySearchKeyInteractor.mockResolvedValue([]);

    await runAction(getPrivatePractitionersBySearchKeyAction, {
      modules: {
        presenter,
      },
      state: { form: { practitionerSearch: 'Test Practitioner2' } },
    });

    expect(
      applicationContext.getUseCases()
        .getPrivatePractitionersBySearchKeyInteractor.mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases()
        .getPrivatePractitionersBySearchKeyInteractor.mock.calls[0][1]
        .searchKey,
    ).toEqual('Test Practitioner2');
    expect(successStub).not.toBeCalled();
    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
