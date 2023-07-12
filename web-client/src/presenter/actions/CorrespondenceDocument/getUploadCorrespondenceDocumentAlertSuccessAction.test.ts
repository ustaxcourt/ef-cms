import { getUploadCorrespondenceDocumentAlertSuccessAction } from './getUploadCorrespondenceDocumentAlertSuccessAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getUploadCorrespondenceDocumentAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getUploadCorrespondenceDocumentAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
