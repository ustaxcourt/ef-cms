import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentSelectedForPreviewAction } from './getDocumentSelectedForPreviewAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

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
});
