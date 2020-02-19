import { runAction } from 'cerebral/test';
import { setCaseConfirmationFormDocumentTitleAction } from './setCaseConfirmationFormDocumentTitleAction';

describe('setCaseConfirmationFormDocumentTitleAction', () => {
  it('sets form.contactSecondary to the contact prop', async () => {
    const result = await runAction(setCaseConfirmationFormDocumentTitleAction, {
      state: {
        caseDetail: {
          docketNumber: '101-20',
        },
      },
    });

    expect(result.state.form.documentTitle).toEqual(
      'Case Confirmation for 101-20',
    );
  });
});
