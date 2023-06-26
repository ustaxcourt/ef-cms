import { navigateToViewAllDocumentsAction } from './navigateToViewAllDocumentsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

const routeStub = jest.fn();

presenter.providers.router = {
  route: routeStub,
};

describe('navigateToViewAllDocumentsAction', () => {
  it('should set the state.wizardStep to the ViewAllDocuments and route to view all documents', async () => {
    const result = await runAction(navigateToViewAllDocumentsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '122-19',
        },
      },
    });

    expect(result.state.wizardStep).toEqual('ViewAllDocuments');
    expect(routeStub.mock.calls.length).toEqual(1);
    expect(routeStub.mock.calls[0][0]).toEqual(
      '/case-detail/122-19/file-a-document/all-document-categories',
    );
  });
});
