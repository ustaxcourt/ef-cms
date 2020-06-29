import { runAction } from 'cerebral/test';
import { setSignAndCompleteDocumentSigningSuccessAlertAction } from './setSignAndCompleteDocumentSigningSuccessAlertAction';

describe('setSignAndCompleteDocumentSigningSuccessAlertAction', () => {
  it('returns expected success message', async () => {
    const result = await runAction(
      setSignAndCompleteDocumentSigningSuccessAlertAction,
    );

    expect(result.output.alertSuccess.message).toEqual(
      'Your document has been successfully created and attached to this message',
    );
  });
});
