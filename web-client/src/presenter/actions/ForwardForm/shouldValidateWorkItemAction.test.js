import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { shouldValidateWorkItemAction } from './shouldValidateWorkItemAction';

describe('shouldValidateWorkItemAction', () => {
  let validateStub;
  let ignoreStub;

  beforeAll(() => {
    validateStub = jest.fn();
    ignoreStub = jest.fn();

    presenter.providers.path = {
      ignore: ignoreStub,
      validate: validateStub,
    };
  });

  it('should validate workItem if flagged per workItemMetadata.showValidation', async () => {
    await runAction(shouldValidateWorkItemAction, {
      modules: {
        presenter,
      },
      state: {
        workItemMetadata: {
          showValidation: true,
        },
      },
    });

    expect(validateStub).toHaveBeenCalled();
  });

  it("should ignore validation for a workItem if we're not showing validation", async () => {
    await runAction(shouldValidateWorkItemAction, {
      modules: {
        presenter,
      },
    });

    expect(ignoreStub).toHaveBeenCalled();
  });
});
