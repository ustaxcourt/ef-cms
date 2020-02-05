import { getUploadCourtIssuedDocumentAndUploadAnotherAlertSuccessAction } from './getUploadCourtIssuedDocumentAndUploadAnotherAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getUploadCourtIssuedDocumentAndUploadAnotherAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getUploadCourtIssuedDocumentAndUploadAnotherAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
