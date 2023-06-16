import { canUnconsolidateAction } from './canUnconsolidateAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('canUnConsolidateAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = { error: errorStub, success: successStub };
  });

  it('should call error path when no cases are selected', async () => {
    await runAction(canUnconsolidateAction, {
      modules: {
        presenter,
      },
      state: { modal: {} },
    });

    expect(errorStub).toHaveBeenCalled();
  });

  it('should call error path when no cases are selected with a "true" value', async () => {
    await runAction(canUnconsolidateAction, {
      modules: {
        presenter,
      },
      state: { modal: { casesToRemove: { abc: false, def: false } } },
    });

    expect(errorStub).toHaveBeenCalled();
  });

  it('should call success path when non-empty list of cases is in state', async () => {
    await runAction(canUnconsolidateAction, {
      modules: {
        presenter,
      },
      state: { modal: { casesToRemove: { abc: true, def: false } } },
    });

    expect(successStub).toHaveBeenCalled();
  });
});
