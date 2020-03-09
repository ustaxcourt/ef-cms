import { navigateToEditSavedDocumentDetailAction } from './navigateToEditSavedDocumentDetailAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('navigateToEditSavedDocumentDetailAction', () => {
  let routeStub;

  beforeEach(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to the edit saved document detail view', async () => {
    await runAction(navigateToEditSavedDocumentDetailAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketNumber: '101-12',
        },
        documentId: 'document-id-123',
      },
    });

    expect(routeStub.mock.calls[0][0]).toEqual(
      '/case-detail/101-12/documents/document-id-123/edit-saved',
    );
  });

  it('navigates to the edit saved document detail view with the appropriate tab', async () => {
    await runAction(navigateToEditSavedDocumentDetailAction, {
      modules: { presenter },
      props: {
        tab: 'caseInfo',
      },
      state: {
        caseDetail: {
          docketNumber: '101-12',
        },
        documentId: 'document-id-123',
      },
    });

    expect(routeStub.mock.calls[0][0]).toEqual(
      '/case-detail/101-12/documents/document-id-123/edit-saved?tab=caseInfo',
    );
  });

  it('does not navigate to the edit saved document detail view if document id is not provided', async () => {
    await runAction(navigateToEditSavedDocumentDetailAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          docketNumber: '101-12',
        },
      },
    });

    expect(routeStub).not.toHaveBeenCalled();
  });

  it('does not navigate to the edit saved document detail view if docketNumber is not provided', async () => {
    await runAction(navigateToEditSavedDocumentDetailAction, {
      modules: { presenter },
      state: {
        caseDetail: {},
        documentId: 'document-id-123',
      },
    });

    expect(routeStub).not.toHaveBeenCalled();
  });
});
