import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { openMessageAttachmentDocumentAction } from '@web-client/presenter/actions/openMessageAttachmentDocumentAction';

describe('openMessageAttachmentDocumentAction', () => {
  const mockDownloadUrl = 'example.com';

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockReturnValue({
        url: mockDownloadUrl,
      });
  });

  it('should get url for document download and pass it to utility to open it in a new tab', async () => {
    await runAction(openMessageAttachmentDocumentAction, {
      modules: { presenter },
      props: {
        documentId: '1234',
        docketNumber: '101-26',
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentDownloadUrlInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      key: '1234',
      docketNumber: '101-26',
    });

    expect(
      applicationContext.getUtilities().openUrlInNewTab,
    ).toHaveBeenCalledWith({
      url: mockDownloadUrl,
    });
  });

  it('should throw error if url cannot be retrieved', async () => {
    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockRejectedValue(
        new Error('error retrieving url'),
      );

    await expect(
      runAction(openMessageAttachmentDocumentAction, {
        modules: { presenter },
        props: {
          documentId: '1234',
          docketNumber: '101-26',
        },
      }),
    ).rejects.toThrow('error retrieving url');

    expect(
      applicationContext.getUtilities().openUrlInNewTab,
    ).not.toHaveBeenCalled();
  });
});
