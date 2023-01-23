import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validatePenaltiesAction } from './validatePenaltiesAction';

describe('validatePenaltiesAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };

    applicationContext
      .getUseCases()
      .validatePenaltiesInteractor.mockReturnValue(null);
  });

  it('should call the error path when current penalties has a length less than 1', async () => {
    await runAction(validatePenaltiesAction, {
      modules: {
        presenter,
      },
      props: { allPenalties: [], itemizedPenaltiesOfCurrentType: [] },
      state: {},
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toEqual({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      error: {
        penaltyAmount: 'Please enter a penalty.',
      },
    });
  });

  //TODO: do the thing
  it('should call the success path when current penalties has a length greather than 1', async () => {
    await runAction(validatePenaltiesAction, {
      modules: {
        presenter,
      },
      props: { allPenalties: [], itemizedPenaltiesOfCurrentType: [3] },
      state: {},
    });

    expect(errorStub).toHaveBeenCalled();
    expect(errorStub.mock.calls[0][0]).toEqual({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      error: {
        penaltyAmount: 'Please enter a penalty.',
      },
    });
  });
});
