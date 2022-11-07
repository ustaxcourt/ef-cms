import { getEditPractitionerDocumentAlertSuccessAction } from './getEditPractitionerDocumentAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getEditPractitionerDocumentAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getEditPractitionerDocumentAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
