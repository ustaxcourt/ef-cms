import { navigateToDraftDocumentsAction } from './navigateToDraftDocumentsAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToDraftDocumentsAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to Draft Documents for the given case using props.docketNumber', async () => {
    await runAction(navigateToDraftDocumentsAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '123-19',
      },
    });

    expect(routeStub).toHaveBeenCalledWith(
      '/case-detail/123-19/draft-documents',
    );
  });

  it('navigates to Draft Documents for the given case using props.caseDetail.docketNumber', async () => {
    await runAction(navigateToDraftDocumentsAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketNumber: '123-19',
        },
      },
    });

    expect(routeStub).toHaveBeenCalledWith(
      '/case-detail/123-19/draft-documents',
    );
  });

  it('navigates to Draft Documents for the given case using state.caseDetail.docketNumber', async () => {
    await runAction(navigateToDraftDocumentsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-19',
        },
      },
    });

    expect(routeStub).toHaveBeenCalledWith(
      '/case-detail/123-19/draft-documents',
    );
  });

  it('does not call router if docketNumber is not found', async () => {
    await runAction(navigateToDraftDocumentsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
      },
    });

    expect(routeStub).not.toBeCalled();
  });
});
