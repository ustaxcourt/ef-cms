import { resetAddCorrespondenceAction } from './resetAddCorrespondenceAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetAddCorrespondenceAction', () => {
  it('sets default properties on state for the Add Correspondence File page', async () => {
    const result = await runAction(resetAddCorrespondenceAction, {
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'affidavit',
          documentUploadMode:
            'looking at it really hard and trying not to forget whats on the page',
        },
      },
    });

    expect(result.state).toMatchObject({
      currentViewMetadata: {
        documentSelectedForScan: 'primaryDocumentFile',
        documentUploadMode: 'scan',
      },
    });
  });
});
