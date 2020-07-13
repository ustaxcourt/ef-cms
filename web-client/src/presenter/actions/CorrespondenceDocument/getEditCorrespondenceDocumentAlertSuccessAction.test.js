import { getEditCorrespondenceDocumentAlertSuccessAction } from './getEditCorrespondenceDocumentAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getEditCorrespondenceDocumentAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getEditCorrespondenceDocumentAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
