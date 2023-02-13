import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setPdfPreviewUrlForEditPaperFilingAction } from './setPdfPreviewUrlForEditPaperFilingAction';

presenter.providers.applicationContext = applicationContext;

describe('setPdfPreviewUrlForEditPaperFilingAction', () => {
  const DOCUMENT_ID = 'e77bd82d-adff-4c16-bcf0-8226108a568f';

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockReturnValue({
        url: 'www.example.com',
      });
  });

  it('sets pdfPreviewUrl and currentViewMetadata.documentUploadMode if the selected document has a file attached', async () => {
    const result = await runAction(setPdfPreviewUrlForEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: DOCUMENT_ID,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: DOCUMENT_ID,
              isFileAttached: true,
            },
          ],
          docketNumber: '123-20',
        },
        currentViewMetadata: {},
      },
    });

    expect(result.state).toMatchObject({
      currentViewMetadata: {
        documentUploadMode: 'preview',
      },
      pdfPreviewUrl: 'www.example.com',
    });
  });

  it('does not set pdfPreviewUrl and currentViewMetadata.documentUploadMode if the selected document does not have a file attached', async () => {
    const result = await runAction(setPdfPreviewUrlForEditPaperFilingAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: DOCUMENT_ID,
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: DOCUMENT_ID,
              isFileAttached: false,
            },
          ],
          docketNumber: '123-20',
        },
        currentViewMetadata: {},
      },
    });

    expect(result.state.currentViewMetadata.documentUploadMode).toBeUndefined();
    expect(result.state.pdfPreviewUrl).toBeUndefined();
  });
});
