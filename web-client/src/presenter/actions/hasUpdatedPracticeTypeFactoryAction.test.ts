import { hasUpdatedPracticeTypeFactoryAction } from './hasUpdatedPracticeTypeFactoryAction';
import { runAction } from '@web-client/presenter/test.cerebral';
import { presenter } from '../presenter-mock';

describe('hasUpdatedPracticeTypeFactoryAction', () => {
  const pathYesStub = jest.fn();
  const pathNoStub = jest.fn();

  presenter.providers.path = {
    no: pathNoStub,
    yes: pathYesStub,
  };
  it('should call the "yes" path when the updated practitioner type and original practitioner type do not match', async () => {
    const hasUpdatedPracticeTypeAction =
      hasUpdatedPracticeTypeFactoryAction('testFormField');
    await runAction(hasUpdatedPracticeTypeAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          testFormField: 'DOJ',
          originalPracticeType: 'IRS',
        },
      },
    });
    expect(pathYesStub).toHaveBeenCalled();
    expect(pathYesStub.mock.calls.length).toBe(1);
  });
  it('should call the "no" path when the updated practitioner type and original practitioner type match', async () => {
    const hasUpdatedPracticeTypeAction =
      hasUpdatedPracticeTypeFactoryAction('testFormField');
    await runAction(hasUpdatedPracticeTypeAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          testFormField: 'IRS',
          originalPracticeType: 'IRS',
        },
      },
    });
    expect(pathNoStub).toHaveBeenCalled();
    expect(pathNoStub.mock.calls.length).toBe(1);
  });
});
