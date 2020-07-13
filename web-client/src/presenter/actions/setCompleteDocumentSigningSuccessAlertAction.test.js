import { runAction } from 'cerebral/test';
import { setCompleteDocumentSigningSuccessAlertAction } from './setCompleteDocumentSigningSuccessAlertAction';

describe('setCompleteDocumentSigningSuccessAlertAction', () => {
  it('returns expected success message', async () => {
    const result = await runAction(
      setCompleteDocumentSigningSuccessAlertAction,
    );

    expect(result.output.alertSuccess.message).toEqual('Signature added.');
  });
});
