import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { suggestSaveForLaterValidationAction } from './suggestSaveForLaterValidationAction';

describe('suggestSaveForLaterValidationAction', () => {
  it('does nothing if there are no errors', async () => {
    const result = await runAction(suggestSaveForLaterValidationAction, {
      modules: {
        presenter,
      },
      props: { bananas: true },
      state: {
        caseDetail: {
          isPaper: true,
        },
      },
    });

    expect(result.props).toEqual({ bananas: true });
  });

  it('updates error message if required by this sequence', async () => {
    const result = await runAction(suggestSaveForLaterValidationAction, {
      modules: {
        presenter,
      },
      props: {
        errors: {
          primaryDocumentFile: 'something went wrong here',
        },
      },
      state: {
        caseDetail: {
          isPaper: true,
        },
      },
    });

    expect(result.output.errors.primaryDocumentFile).toBe(
      'Scan or upload a document to serve, or click Save for Later to serve at a later time',
    );
  });
});
