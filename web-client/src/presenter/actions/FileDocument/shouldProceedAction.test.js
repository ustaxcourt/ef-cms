import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { shouldProceedAction } from './shouldProceedAction';

describe('shouldProceedAction', () => {
  let proceedStub;
  let ignoreStub;

  beforeAll(() => {
    proceedStub = jest.fn();
    ignoreStub = jest.fn();

    presenter.providers.path = {
      ignore: ignoreStub,
      proceed: proceedStub,
    };
  });

  it('should return proceed if props.doNotProceed is FALSE', async () => {
    await runAction(shouldProceedAction, {
      modules: {
        presenter,
      },
      props: {
        doNotProceed: false,
      },
    });

    expect(proceedStub).toHaveBeenCalled();
  });

  it('should return ignore if props.doNotProceed is TRUE', async () => {
    await runAction(shouldProceedAction, {
      modules: {
        presenter,
      },
      props: {
        doNotProceed: true,
      },
    });

    expect(ignoreStub).toHaveBeenCalled();
  });
});
