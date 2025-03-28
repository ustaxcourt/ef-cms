import { runAction } from '@web-client/presenter/test.cerebral';
import { checkIfTermInfoIsInStateAction } from '@web-client/presenter/actions/TrialSession/TermBuilder/checkIfTermInfoIsInStateAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';

describe('checkIfTermInfoIsInStateAction', () => {
  const pathStub = {
    doesNotExist: jest.fn(),
    exist: jest.fn(),
  };

  beforeEach(() => {
    pathStub.doesNotExist = jest.fn();
    pathStub.exist = jest.fn();

    presenter.providers.path = pathStub;
  });

  it('should call "exist" path when term builder info is available in state', async () => {
    await runAction(checkIfTermInfoIsInStateAction, {
      modules: {
        presenter,
      },
      state: {
        [STATE_KEYS.TERM_BUILDER_INFORMATION]: {},
      },
    });

    const existsCalls = pathStub.exist.mock.calls;
    expect(existsCalls.length).toEqual(1);

    const doesNotExistCalls = pathStub.doesNotExist.mock.calls;
    expect(doesNotExistCalls.length).toEqual(0);
  });

  it('should call "doesNotExist" path when term builder info is not available in state', async () => {
    await runAction(checkIfTermInfoIsInStateAction, {
      modules: {
        presenter,
      },
      state: {
        [STATE_KEYS.TERM_BUILDER_INFORMATION]: undefined,
      },
    });

    const existsCalls = pathStub.exist.mock.calls;
    expect(existsCalls.length).toEqual(0);

    const doesNotExistCalls = pathStub.doesNotExist.mock.calls;
    expect(doesNotExistCalls.length).toEqual(1);
  });
});
