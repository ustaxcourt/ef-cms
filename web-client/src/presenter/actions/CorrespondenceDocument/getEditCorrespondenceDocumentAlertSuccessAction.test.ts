import { getEditCorrespondenceDocumentAlertSuccessAction } from './getEditCorrespondenceDocumentAlertSuccessAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getEditCorrespondenceDocumentAlertSuccessAction', () => {
  it('should return alertSuccess prop', async () => {
    const result = await runAction(
      getEditCorrespondenceDocumentAlertSuccessAction,
      {},
    );
    expect(result.output.alertSuccess).toBeTruthy();
  });
});
