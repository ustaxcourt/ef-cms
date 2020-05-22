import { getDeleteCorrespondenceDocumentAlertErrorAction } from './getDeleteCorrespondenceDocumentAlertErrorAction';
import { runAction } from 'cerebral/test';

describe('getDeleteCorrespondenceDocumentAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getDeleteCorrespondenceDocumentAlertErrorAction,
      {},
    );
    expect(result.output.alertError).toBeTruthy();
  });
});
