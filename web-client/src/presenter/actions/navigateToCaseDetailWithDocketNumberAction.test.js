import { navigateToCaseDetailWithDocketNumberAction } from './navigateToCaseDetailWithDocketNumberAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToCaseDetailWithDocketNumberAction', () => {
  let routeMock;

  beforeAll(() => {
    routeMock = jest.fn();
    presenter.providers.router = {
      route: routeMock,
    };
  });

  it('should call the router to navigate to the case detail page for the given props.docketNumber', async () => {
    await runAction(navigateToCaseDetailWithDocketNumberAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '123-45',
      },
    });

    expect(routeMock).toHaveBeenCalledWith('/case-detail/123-45');
  });

  it('should call the router to navigate to the case detail page for the given state.caseDetail.docketNumber when props.docketNumber is undefined', async () => {
    await runAction(navigateToCaseDetailWithDocketNumberAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          docketNumber: '123-45',
        },
      },
    });

    expect(routeMock).toHaveBeenCalledWith('/case-detail/123-45');
  });

  it('should not call the router if docketNumber is not set', async () => {
    await runAction(navigateToCaseDetailWithDocketNumberAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {},
      },
    });

    expect(routeMock).not.toHaveBeenCalled();
  });
});
