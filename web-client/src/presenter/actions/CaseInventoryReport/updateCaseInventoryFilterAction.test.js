import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateCaseInventoryFilterAction } from './updateCaseInventoryFilterAction';

describe('updateCaseInventoryFilterAction', () => {
  const proceedMock = jest.fn();
  const noMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    presenter.providers.path = {
      no: noMock,
      proceed: proceedMock,
    };
  });

  it('should return path.proceed and set the filter on screenMetadata if not clearing a filter', async () => {
    const result = await runAction(updateCaseInventoryFilterAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'associatedJudge',
        value: 'Chief Judge',
      },
      state: {
        screenMetadata: {
          status: 'New',
        },
      },
    });

    expect(proceedMock).toBeCalled();
    expect(noMock).not.toBeCalled();
    expect(result.state.screenMetadata.associatedJudge).toEqual('Chief Judge');
  });

  it('should return path.proceed and set the filter to empty string if clearing a filter but another filter is present', async () => {
    const result = await runAction(updateCaseInventoryFilterAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'associatedJudge',
        value: '',
      },
      state: {
        screenMetadata: {
          status: 'New',
        },
      },
    });

    expect(proceedMock).toBeCalled();
    expect(noMock).not.toBeCalled();
    expect(result.state.screenMetadata.associatedJudge).toEqual('');
  });

  it('should return path.no if clearing the only remaining filter', async () => {
    const result = await runAction(updateCaseInventoryFilterAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'associatedJudge',
        value: '',
      },
      state: {
        screenMetadata: {
          associatedJudge: 'Chief Judge',
        },
      },
    });

    expect(noMock).toBeCalled();
    expect(proceedMock).not.toBeCalled();
    expect(result.state.screenMetadata.associatedJudge).toEqual('Chief Judge');
  });
});
