import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocumentUrlForPreviewAction } from './getDocumentUrlForPreviewAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDocumentUrlForPreviewAction', () => {
  const mockUrl = 'www.example.com';
  const mockDocketNumber = '123-45';
  const mockDocketEntryId = applicationContext.getUniqueId();

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
        documentInS3: { docketEntryId: mockDocketEntryId },
      },
      state: {
        form: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentDownloadUrlInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: mockDocketNumber,
      key: mockDocketEntryId,
    });
  });

  it('should return the document id and pdfUrl for the document specified in props.documentInS3', async () => {
    const { output } = await runAction(getDocumentUrlForPreviewAction, {
      modules: {
        presenter,
      },
      props: {
        documentInS3: { docketEntryId: mockDocketEntryId },
      },
      state: {
        form: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(output.docketEntryId).toBe(mockDocketEntryId);
    expect(output.pdfUrl).toBe(mockUrl);
  });
});
