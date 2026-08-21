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

  it('should return props.documentInS3 when a documentId prop matches a docket entry', async () => {
    const mockDocketEntry = {
      docketEntryId: 'abc-123',
      documentTitle: 'Petition',
    };

    const { output } = await runAction(getDocumentSelectedForPreviewAction, {
      modules: {
        presenter,
      },
      props: {
        documentId: 'abc-123',
      },
      state: {
        form: {
          docketEntries: [mockDocketEntry],
        },
      },
    });

    expect(output).toEqual({ documentInS3: mockDocketEntry });
  });

  it('should return an empty object when no selected preview document exists', async () => {
    const { output } = await runAction(getDocumentSelectedForPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {},
        form: {
          docketEntries: [mockPetitionFile],
        },
      },
    });

    expect(output).toEqual({});
  });

  it('should return props.documentInS3 when documentSelectedForPreview is a matching docketEntryId', async () => {
    const mockDocketEntry = {
      docketEntryId: 'docket-entry-id-1',
      documentTitle: 'Stipulation',
    };

    const { output } = await runAction(getDocumentSelectedForPreviewAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForPreview: 'docket-entry-id-1',
        },
        form: {
          docketEntries: [mockDocketEntry],
        },
      },
    });

    expect(output).toEqual({ documentInS3: mockDocketEntry });
  });
});
