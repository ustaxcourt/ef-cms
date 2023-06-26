import { getUploadPractitionerDocumentAlertSuccessAction } from './getUploadPractitionerDocumentAlertSuccessAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getUploadCourtIssuedDocumentAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getUploadPractitionerDocumentAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
