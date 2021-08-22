import { getUploadCourtIssuedDocumentAlertSuccessAction } from './getUploadCourtIssuedDocumentAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getUploadCourtIssuedDocumentAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getUploadCourtIssuedDocumentAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
