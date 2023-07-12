import { navigateToDocketQcAction } from './navigateToDocketQcAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToDocketQcAction', () => {
  const mockRouter = jest.fn();

  beforeAll(() => {
    presenter.providers.router = {
      route: mockRouter,
    };
  });

  it('navigates to expected url if docketEntry is on props and caseDetail is defined', async () => {
    await runAction(navigateToDocketQcAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: 'abc',
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
        constants: {
          FROM_PAGES: {
            caseDetail: 'case-detail',
          },
        },
      },
    });

    expect(mockRouter).toHaveBeenCalledWith(
      '/case-detail/101-20/documents/abc/edit?fromPage=case-detail',
    );
  });

  it('navigates to expected url if props.docketNumber is set', async () => {
    await runAction(navigateToDocketQcAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: 'abc',
        docketNumber: '105-20',
      },
      state: {
        caseDetail: {},
        constants: {
          FROM_PAGES: {
            caseDetail: 'case-detail',
          },
        },
      },
    });

    expect(mockRouter).toHaveBeenCalledWith(
      '/case-detail/105-20/documents/abc/edit?fromPage=case-detail',
    );
  });

  it('does not try to navigate if docket number is undefined', async () => {
    await runAction(navigateToDocketQcAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: 'abc',
      },
      state: {
        caseDetail: {},
        constants: {
          FROM_PAGES: {
            caseDetail: 'case-detail',
          },
        },
      },
    });

    expect(mockRouter).not.toHaveBeenCalled();
  });
});
