import { navigateToCaseDetailAction } from './navigateToCaseDetailAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToCaseDetailAction', () => {
  let routerStub;

  const mockDocketNumber = '123-45';

  beforeAll(() => {
    routerStub = jest.fn();

    presenter.providers.router = {
      route: routerStub,
    };
  });

  it('should route to the case detail using props.docketNumber when props.docketNumber is defined', async () => {
    await runAction(navigateToCaseDetailAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: mockDocketNumber,
      },
    });

    expect(routerStub.mock.calls[0][0]).toBe(
      `/case-detail/${mockDocketNumber}`,
    );
  });

  it('should route to the case detail using props.caseDetail.docketNumber when props.docketNumber is undefined', async () => {
    await runAction(navigateToCaseDetailAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        docketNumber: undefined,
      },
    });

    expect(routerStub.mock.calls[0][0]).toBe(
      `/case-detail/${mockDocketNumber}`,
    );
  });

  it('should route to the case detail using state.caseDetail.docketNumber when props.docketNumber and props.caseDetail are undefined', async () => {
    await runAction(navigateToCaseDetailAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: undefined,
        docketNumber: undefined,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(routerStub.mock.calls[0][0]).toBe(
      `/case-detail/${mockDocketNumber}`,
    );
  });

  it('should not invoke the router when docket number is undefined in props and state', async () => {
    await runAction(navigateToCaseDetailAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: undefined,
        docketNumber: undefined,
      },
      state: {
        caseDetail: {
          docketNumber: undefined,
        },
      },
    });

    expect(routerStub).not.toHaveBeenCalled();
  });
});
