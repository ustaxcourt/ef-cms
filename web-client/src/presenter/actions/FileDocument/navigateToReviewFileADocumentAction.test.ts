import { navigateToReviewFileADocumentAction } from './navigateToReviewFileADocumentAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

const routeStub = jest.fn();

presenter.providers.router = {
  route: routeStub,
};

describe('navigateToReviewFileADocumentAction', () => {
  const mockDocketNumber = '122-19';

  it('should set the state.wizardStep to the FileDocumentReview and route to review filing a document', async () => {
    const result = await runAction(navigateToReviewFileADocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(result.state.wizardStep).toEqual('FileDocumentReview');
    expect(routeStub.mock.calls.length).toEqual(1);
    expect(routeStub.mock.calls[0][0]).toEqual(
      `/case-detail/${mockDocketNumber}/file-a-document/review`,
    );
  });
});
