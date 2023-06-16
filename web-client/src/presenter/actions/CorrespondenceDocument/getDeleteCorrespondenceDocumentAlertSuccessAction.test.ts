import { getDeleteCorrespondenceDocumentAlertSuccessAction } from './getDeleteCorrespondenceDocumentAlertSuccessAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDeleteCorrespondenceDocumentAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getDeleteCorrespondenceDocumentAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
