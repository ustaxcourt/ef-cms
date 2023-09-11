import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { navigateToReviewFileADocumentAction } from './navigateToReviewFileADocumentAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

const routeStub = jest.fn();

presenter.providers.router = {
  route: routeStub,
};
presenter.providers.applicationContext = applicationContext;

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

  it('should set form.redactionAcknowledgement to false when the REDACTION_ACKNOWLEDGEMENT_ENABLED flag is true (and not do so if the flag is not true)', async () => {
    let result = await runAction(navigateToReviewFileADocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        featureFlags: { 'redaction-acknowledgement-enabled': true },
      },
    });

    expect(result.state.form.redactionAcknowledgement).toEqual(false);

    result = await runAction(navigateToReviewFileADocumentAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        featureFlags: {},
      },
    });

    expect(result.state.form).toEqual(undefined);
  });
});
