import { getIrsPractitionersBySearchKeyAction } from './getIrsPractitionersBySearchKeyAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

let getIrsPractitionersBySearchKeyInteractorStub;

describe('getIrsPractitionersBySearchKeyAction', () => {
  let successStub, errorStub;

  beforeEach(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    getIrsPractitionersBySearchKeyInteractorStub = jest.fn().mockResolvedValue([
      {
        name: 'Test Respondent',
        userId: '345',
      },
    ]);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getIrsPractitionersBySearchKeyInteractor: getIrsPractitionersBySearchKeyInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('calls the use case to get the matching irsPractitioners and calls the success path if irsPractitioners are returned', async () => {
    await runAction(getIrsPractitionersBySearchKeyAction, {
      modules: {
        presenter,
      },
      state: { form: { respondentSearch: 'Test Respondent' } },
    });
    expect(
      getIrsPractitionersBySearchKeyInteractorStub.mock.calls.length,
    ).toEqual(1);
    expect(
      getIrsPractitionersBySearchKeyInteractorStub.mock.calls[0][0].searchKey,
    ).toEqual('Test Respondent');
    expect(successStub.mock.calls.length).toEqual(1);
    expect(errorStub).not.toBeCalled();
  });

  it('calls the use case to get the matching irsPractitioners and calls the error path if no irsPractitioners are returned', async () => {
    getIrsPractitionersBySearchKeyInteractorStub = jest
      .fn()
      .mockResolvedValue([]);

    await runAction(getIrsPractitionersBySearchKeyAction, {
      modules: {
        presenter,
      },
      state: { form: { respondentSearch: 'Test Respondent2' } },
    });
    expect(
      getIrsPractitionersBySearchKeyInteractorStub.mock.calls.length,
    ).toEqual(1);
    expect(
      getIrsPractitionersBySearchKeyInteractorStub.mock.calls[0][0].searchKey,
    ).toEqual('Test Respondent2');
    expect(successStub).not.toBeCalled();
    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
