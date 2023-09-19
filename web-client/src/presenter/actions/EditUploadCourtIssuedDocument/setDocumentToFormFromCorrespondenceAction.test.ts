import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocumentToFormFromCorrespondenceAction } from './setDocumentToFormFromCorrespondenceAction';

describe('setDocumentToFormFromCorrespondenceAction', () => {
  let documentIdToEdit;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
  });

  it('sets state.form for the given case and documentId when the document is a correspondence', async () => {
    documentIdToEdit = '234';
    const mockCorrespondence = {
      correspondenceId: '234',
      documentTitle: 'a lovely correspondence',
    };

    const result = await runAction(setDocumentToFormFromCorrespondenceAction, {
      modules: { presenter },
      props: {
        caseDetail: {
          correspondence: [mockCorrespondence],
          docketEntries: [
            {
              documentId: '321',
              documentType: 'Petition',
            },
          ],
          docketNumber: '123-45',
        },
        correspondenceId: documentIdToEdit,
      },
    });

    expect(result.state.form).toEqual({
      ...mockCorrespondence,
      documentIdToEdit,
      primaryDocumentFile: true,
    });
  });

  it('does nothing if correspondenceId does not match a document', async () => {
    documentIdToEdit = '123';

    const result = await runAction(setDocumentToFormFromCorrespondenceAction, {
      modules: { presenter },
      props: {
        caseDetail: {
          correspondence: [],
          docketEntries: [],
          docketNumber: '123-45',
        },
        correspondenceId: '890',
      },
    });

    expect(result.state.form).toBeUndefined();
  });
});
