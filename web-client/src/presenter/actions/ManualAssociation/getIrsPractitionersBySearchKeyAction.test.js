import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getIrsPractitionersBySearchKeyAction } from './getIrsPractitionersBySearchKeyAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getIrsPractitionersBySearchKeyAction', () => {
  let successStub, errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getIrsPractitionersBySearchKeyInteractor.mockResolvedValue([
        {
          name: 'Test Respondent',
          userId: '345',
        },
      ]);

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
      applicationContext.getUseCases().getIrsPractitionersBySearchKeyInteractor
        .mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().getIrsPractitionersBySearchKeyInteractor
        .mock.calls[0][1].searchKey,
    ).toEqual('Test Respondent');
    expect(successStub.mock.calls.length).toEqual(1);
    expect(errorStub).not.toBeCalled();
  });

  it('calls the use case to get the matching irsPractitioners and calls the error path if no irsPractitioners are returned', async () => {
    applicationContext
      .getUseCases()
      .getIrsPractitionersBySearchKeyInteractor.mockResolvedValue([]);

    await runAction(getIrsPractitionersBySearchKeyAction, {
      modules: {
        presenter,
      },
      state: { form: { respondentSearch: 'Test Respondent2' } },
    });

    expect(
      applicationContext.getUseCases().getIrsPractitionersBySearchKeyInteractor
        .mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().getIrsPractitionersBySearchKeyInteractor
        .mock.calls[0][1].searchKey,
    ).toEqual('Test Respondent2');
    expect(successStub).not.toBeCalled();
    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
