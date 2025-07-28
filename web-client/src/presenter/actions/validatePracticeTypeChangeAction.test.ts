import { validatePracticeTypeChangeAction } from './validatePracticeTypeChangeAction';
import { runAction } from '@web-client/presenter/test.cerebral';
import { presenter } from '../presenter-mock';

describe('validatePracticeTypeChangeAction', () => {
  const pathSuccessStub = jest.fn();
  const pathErrorStub = jest.fn();

  presenter.providers.path = {
    success: pathSuccessStub,
    error: pathErrorStub,
  };
  it('should call the "success" path when practitioner has no open cases', async () => {
    await runAction(validatePracticeTypeChangeAction, {
      modules: {
        presenter,
      },
      state: {
        practitionerInformationHelper: {
          openCasesTotal: 0,
        },
      },
    });
    expect(pathSuccessStub).toHaveBeenCalled();
    expect(pathSuccessStub.mock.calls.length).toBe(1);
  });
  it('should call the "error" path when practitioner has no open cases', async () => {
    await runAction(validatePracticeTypeChangeAction, {
      modules: {
        presenter,
      },
      state: {
        practitionerInformationHelper: {
          openCasesTotal: 5,
        },
      },
    });
    expect(pathErrorStub).toHaveBeenCalled();
    expect(pathErrorStub.mock.calls.length).toBe(1);
  });
});
