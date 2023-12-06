import { navigateToFileADocumentAction } from './navigateToFileADocumentAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

const routeStub = jest.fn();

presenter.providers.router = {
  route: routeStub,
};

describe('navigateToFileADocumentAction', () => {
  const mockDocketNumber = '122-19';

  it('should set the state.wizardStep to the FileDocument and route to file a document', async () => {
    const result = await runAction(navigateToFileADocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(result.state.wizardStep).toEqual('FileDocument');
    expect(routeStub.mock.calls.length).toEqual(1);
    expect(routeStub.mock.calls[0][0]).toEqual(
      `/case-detail/${mockDocketNumber}/file-a-document/details`,
    );
  });
});
