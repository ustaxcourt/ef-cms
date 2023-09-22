import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateAddDeficiencyStatisticsAction } from './validateAddDeficiencyStatisticsAction';

describe('validateAddDeficiencyStatisticsAction', () => {
  let successMock;
  let errorMock;

  beforeAll(() => {
    successMock = jest.fn();
    errorMock = jest.fn();

    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the success path when the deficiency statistics on the form are valid', async () => {
    applicationContext
      .getUseCases()
      .validateAddDeficiencyStatisticsInteractor.mockReturnValue(null);

    await runAction(validateAddDeficiencyStatisticsAction, {
      form: {
        irsTotalPenalties: 3,
      },
      modules: {
        presenter,
      },
    });

    expect(successMock).toHaveBeenCalled();
  });

  it('should call the error path with an error message when the deficiency statistics on the form are invalid', async () => {
    applicationContext
      .getUseCases()
      .validateAddDeficiencyStatisticsInteractor.mockReturnValue({
        irsTotalPenalties: 'Enter total penalties on IRS Notice',
      });

    await runAction(validateAddDeficiencyStatisticsAction, {
      form: {},
      modules: {
        presenter,
      },
    });

    expect(errorMock.mock.calls[0][0]).toEqual({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors: { irsTotalPenalties: 'Enter total penalties on IRS Notice' },
    });
  });

  it('should reformat error messages when errors.irsTotalPenalties & errors.penalties both exist', async () => {
    applicationContext
      .getUseCases()
      .validateAddDeficiencyStatisticsInteractor.mockReturnValue({
        irsTotalPenalties: 'Enter total penalties on IRS Notice',
        penalties: 'Enter at least one IRS penalty.',
      });

    await runAction(validateAddDeficiencyStatisticsAction, {
      form: {},
      modules: {
        presenter,
      },
    });

    expect(errorMock.mock.calls[0][0]).toEqual({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors: {
        irsTotalPenalties:
          'Use IRS Penalty Calculator to calculate total penalties.',
      },
    });
  });
});
