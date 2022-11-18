import { confirmWorkItemAlreadyCompleteAction } from './confirmWorkItemAlreadyCompleteAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('confirmWorkItemAlreadyCompleteAction', () => {
  let routeStub;

  beforeEach(() => {
    global.location = {
      href: '',
    };
  });

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('should redirect to the section inbox when from page was qc-section-inbox', async () => {
    await runAction(confirmWorkItemAlreadyCompleteAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
        constants: {
          FROM_PAGES: {
            qcSectionInbox: 'qc-section-inbox',
          },
        },
        fromPage: 'qc-section-inbox',
      },
    });
    expect(routeStub).toHaveBeenCalledWith('/document-qc/section/inbox');
  });

  it('should redirect to the case detail page when fromPage is not qc-section-inbox', async () => {
    await runAction(confirmWorkItemAlreadyCompleteAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
        constants: {
          FROM_PAGES: {
            qcSectionInbox: 'qc-section-inbox',
          },
        },
        fromPage: 'case-detail',
      },
    });
    expect(routeStub).toHaveBeenCalledWith('/case-detail/101-20');
  });

  it('should redirect to the qc my inbox page when fromPage is qc-my-inbox', async () => {
    await runAction(confirmWorkItemAlreadyCompleteAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
        constants: {
          FROM_PAGES: {
            qcMyInbox: 'qc-my-inbox',
          },
        },
        fromPage: 'qc-my-inbox',
      },
    });
    expect(routeStub).toHaveBeenCalledWith('/document-qc/my/inbox');
  });
});
