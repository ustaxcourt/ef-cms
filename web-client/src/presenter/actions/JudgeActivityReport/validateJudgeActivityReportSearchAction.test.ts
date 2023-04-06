import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateJudgeActivityReportSearchAction } from './validateJudgeActivityReportSearchAction';

describe('validateJudgeActivityReportSearchAction', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    error: mockErrorPath,
    success: mockSuccessPath,
  };

  it('should call the success path when the judge activity search form is valid', async () => {
    applicationContext
      .getUseCases()
      .validateJudgeActivityReportSearchInteractor.mockReturnValue(undefined);

    await runAction(validateJudgeActivityReportSearchAction, {
      modules: {
        presenter,
      },
      state: { form: { endDate: '02/02/2000', startDate: '01/01/1000' } },
    });

    expect(mockSuccessPath).toHaveBeenCalled();
  });

  it('should call the error path when the judge activity search form is NOT valid', async () => {
    applicationContext
      .getUseCases()
      .validateJudgeActivityReportSearchInteractor.mockReturnValue({
        someProperty: 'SomeProperty is required.',
      });

    await runAction(validateJudgeActivityReportSearchAction, {
      modules: {
        presenter,
      },
      state: { form: { endDate: 'gobbeltygook', startDate: undefined } },
    });

    expect(mockErrorPath).toHaveBeenCalled();
  });
});
