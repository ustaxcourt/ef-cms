import { getDeleteCorrespondenceDocumentAlertSuccessAction } from './getDeleteCorrespondenceDocumentAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getDeleteCorrespondenceDocumentAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getDeleteCorrespondenceDocumentAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
