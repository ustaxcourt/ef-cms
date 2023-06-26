import { getDeletePractitionerDocumentAlertSuccessAction } from './getDeletePractitionerDocumentAlertSuccessAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDeletePractitionerDocumentAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getDeletePractitionerDocumentAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
