import { navigateToViewAllDocumentsAction } from './navigateToViewAllDocumentsAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

const routeStub = sinon.stub();

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
    expect(routeStub.calledOnce).toEqual(true);
    expect(routeStub.getCall(0).args[0]).toEqual(
      '/case-detail/122-19/file-a-document/all-document-categories',
    );
  });
});
