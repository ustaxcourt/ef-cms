import { removePetitionFromFormDocumentsAction } from './removePetitionFromFormDocumentsAction';
import { runAction } from 'cerebral/test';

describe('removePetitionFromFormDocumentsAction', () => {
  it('removes the Petition document from the form.docketEntries array', async () => {
    const { state } = await runAction(removePetitionFromFormDocumentsAction, {
      props: {},
      state: {
        form: {
          docketEntries: [
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
    expect(state.form.docketEntries).toEqual([
      {
        documentType: 'Statement of Taxpayer Identification',
      },
    ]);
  });
});
