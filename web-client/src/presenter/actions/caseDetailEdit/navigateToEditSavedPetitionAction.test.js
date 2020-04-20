import { navigateToEditSavedPetitionAction } from './navigateToEditSavedPetitionAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToEditSavedPetitionAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to the edit saved document detail view', async () => {
    await runAction(navigateToEditSavedPetitionAction, {
      modules: { presenter },
      state: {
        documentId: 'document-id-123',
        form: {
          docketNumber: '101-12',
        },
      },
    });

    expect(routeStub.mock.calls[0][0]).toEqual(
      '/case-detail/101-12/documents/document-id-123/edit-saved',
    );
  });

  it('navigates to the edit saved document detail view with the appropriate tab', async () => {
    await runAction(navigateToEditSavedPetitionAction, {
      modules: { presenter },
      props: {
        tab: 'caseInfo',
      },
      state: {
        documentId: 'document-id-123',
        form: {
          docketNumber: '101-12',
        },
      },
    });

    expect(routeStub.mock.calls[0][0]).toEqual(
      '/case-detail/101-12/documents/document-id-123/edit-saved?tab=caseInfo',
    );
  });

  it('does not navigate to the edit saved document detail view if document id is not provided', async () => {
    await runAction(navigateToEditSavedPetitionAction, {
      modules: { presenter },
      state: {
        form: {
          docketNumber: '101-12',
        },
      },
    });

    expect(routeStub).not.toHaveBeenCalled();
  });

  it('does not navigate to the edit saved document detail view if docketNumber is not provided', async () => {
    await runAction(navigateToEditSavedPetitionAction, {
      modules: { presenter },
      state: {
        documentId: 'document-id-123',
        form: {},
      },
    });

    expect(routeStub).not.toHaveBeenCalled();
  });
});
