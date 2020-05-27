import { getUploadCorrespondenceDocumentAlertSuccessAction } from './getUploadCorrespondenceDocumentAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getUploadCorrespondenceDocumentAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getUploadCorrespondenceDocumentAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
