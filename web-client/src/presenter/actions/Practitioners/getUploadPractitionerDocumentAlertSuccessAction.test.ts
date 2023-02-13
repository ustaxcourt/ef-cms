import { getUploadPractitionerDocumentAlertSuccessAction } from './getUploadPractitionerDocumentAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getUploadCourtIssuedDocumentAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getUploadPractitionerDocumentAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
