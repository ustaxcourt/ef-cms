import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentUrlForPreviewAction } from './getDocumentUrlForPreviewAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getDocumentUrlForPreviewAction', () => {
  const mockUrl = 'www.example.com';
  const mockDocketNumber = '123-45';
  const mockDocumentId = applicationContext.getUniqueId();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockResolvedValue({
        url: mockUrl,
      });
  });

  it('should retrieve the url for props.documentInS3 from persistence', async () => {
    await runAction(getDocumentUrlForPreviewAction, {
      modules: {
        presenter,
      },
      props: {
        documentInS3: { documentId: mockDocumentId },
      },
      state: {
        form: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentDownloadUrlInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      docketNumber: mockDocketNumber,
      documentId: mockDocumentId,
    });
  });

  it('should return the document id and pdfUrl for the document specified in props.documentInS3', async () => {
    const { output } = await runAction(getDocumentUrlForPreviewAction, {
      modules: {
        presenter,
      },
      props: {
        documentInS3: { documentId: mockDocumentId },
      },
      state: {
        form: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(output.documentId).toBe(mockDocumentId);
    expect(output.pdfUrl).toBe(mockUrl);
  });
});
