import { removePetitionFromFormDocumentsAction } from './removePetitionFromFormDocumentsAction';
import { runAction } from '@web-client/presenter/test.cerebral';

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
  it('state form docket entries remains unchanged if Petition not found in form.docketEntries array', async () => {
    const { state } = await runAction(removePetitionFromFormDocumentsAction, {
      props: {},
      state: {
        form: {
          docketEntries: [
            {
              documentType: 'Entry of Appearance',
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
        documentType: 'Entry of Appearance',
      },
      {
        documentType: 'Statement of Taxpayer Identification',
      },
    ]);
  });
});
