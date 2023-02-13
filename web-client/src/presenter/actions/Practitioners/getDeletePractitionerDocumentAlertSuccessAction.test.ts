import { getDeletePractitionerDocumentAlertSuccessAction } from './getDeletePractitionerDocumentAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getDeletePractitionerDocumentAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getDeletePractitionerDocumentAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
