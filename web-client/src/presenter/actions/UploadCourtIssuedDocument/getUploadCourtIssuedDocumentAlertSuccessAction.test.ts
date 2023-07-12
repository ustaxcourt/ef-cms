import { getUploadCourtIssuedDocumentAlertSuccessAction } from './getUploadCourtIssuedDocumentAlertSuccessAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getUploadCourtIssuedDocumentAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getUploadCourtIssuedDocumentAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
