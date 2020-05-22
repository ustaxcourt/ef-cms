import { getDeleteCorrespondenceDocumentAlertErrorAction } from './getDeleteCorrespondenceDocumentAlertErrorAction';
import { runAction } from 'cerebral/test';

describe('getDeleteCorrespondenceDocumentAlertErrorAction', () => {
  it('should return alertError prop', async () => {
    const result = await runAction(
      getDeleteCorrespondenceDocumentAlertErrorAction,
      {},
    );
    expect(result.output.alertError).toBeTruthy();
  });
});
