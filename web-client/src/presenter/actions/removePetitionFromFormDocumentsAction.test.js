import { removePetitionFromFormDocumentsAction } from './removePetitionFromFormDocumentsAction';
import { runAction } from 'cerebral/test';

describe('removePetitionFromFormDocumentsAction', () => {
  it('removes the Petition document from the form.documents array', async () => {
    const { state } = await runAction(removePetitionFromFormDocumentsAction, {
      props: {},
      state: {
        form: {
          documents: [
            {
              documentType: 'Petition',
            },
            {
              documentType: 'Statement of Taxpayer Identification',
            },
          ],
        },
      },
    });
    expect(state.form.documents).toEqual([
      {
        documentType: 'Statement of Taxpayer Identification',
      },
    ]);
  });
});
