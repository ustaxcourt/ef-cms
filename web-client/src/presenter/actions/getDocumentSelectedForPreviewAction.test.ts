import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocumentSelectedForPreviewAction } from './getDocumentSelectedForPreviewAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDocumentSelectedForPreviewAction', () => {
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();
  const mockPetitionFile = {
    documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
    name: 'petition',
  };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should return documentInS3 if there is a selected document', async () => {
    const documentId = 'docId1';
    const { output } = await runAction(getDocumentSelectedForPreviewAction, {
      modules: {
        presenter,
      },
      props: {
        documentId,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForPreview: 'petitionFile',
        },
        form: {
          petitionFile: mockPetitionFile,
        },
      },
    });

    expect(output).toEqual({ documentInS3: { docketEntryId: documentId } });
  });

  it('should return props.fileFromBrowserMemory when state.form has an entry equal to documentSelectedForPreview', async () => {
    const { output } = await runAction(getDocumentSelectedForPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForPreview: 'petitionFile',
        },
        form: {
          petitionFile: mockPetitionFile,
        },
      },
    });

    expect(output).toEqual({ fileFromBrowserMemory: mockPetitionFile });
  });

  it('should return props.documentInS3 when state.form does NOT have an entry equal to documentSelectedForPreview', async () => {
    const { output } = await runAction(getDocumentSelectedForPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForPreview: 'petitionFile',
        },
        form: {
          docketEntries: [mockPetitionFile],
        },
      },
    });

    expect(output).toEqual({ documentInS3: mockPetitionFile });
  });
});
