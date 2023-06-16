import { getDeleteCorrespondenceDocumentAlertErrorAction } from './getDeleteCorrespondenceDocumentAlertErrorAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDeleteCorrespondenceDocumentAlertErrorAction', () => {
  it('should return alertError prop', async () => {
    const result = await runAction(
      getDeleteCorrespondenceDocumentAlertErrorAction,
      {},
    );
    expect(result.output.alertError).toBeTruthy();
  });
});
