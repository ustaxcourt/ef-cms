import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { openCaseDocumentDownloadUrlAction } from './openCaseDocumentDownloadUrlAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('openCaseDocumentDownloadUrlAction', () => {
  const mockDocketNumber = '123-20';
  const mockDocketEntryId = 'df5d81cc-d67b-418d-9626-8ad92c939d83';
  const mockDocumentDownloadUrl = 'http://example.com';

  presenter.providers.applicationContext = applicationContext;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        href: undefined,
      },
    });

    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockResolvedValue({
        url: mockDocumentDownloadUrl,
      });
  });

  it('should set state.iframeSrc to the document download url when props.useSameTab is false props.isForIFrame is true', async () => {
    const { state } = await runAction(openCaseDocumentDownloadUrlAction, {
      modules: { presenter },
      props: {
        docketEntryId: mockDocketEntryId,
        docketNumber: mockDocketNumber,
        isForIFrame: true,
        useSameTab: false,
      },
    });

    expect(state.iframeSrc).toBe(mockDocumentDownloadUrl);
  });

  it('should set window.location.href to the document download url when props.useSameTab is true and props.isForIFrame is false', async () => {
    await runAction(openCaseDocumentDownloadUrlAction, {
      modules: { presenter },
      props: {
        docketEntryId: mockDocketEntryId,
        docketNumber: mockDocketNumber,
        isForIFrame: false,
        useSameTab: true,
      },
    });

    expect(window.location.href).toBe(mockDocumentDownloadUrl);
  });

  it('should open in a new tab when props.useSameTab and props.isForIFrame are false', async () => {
    await runAction(openCaseDocumentDownloadUrlAction, {
      modules: { presenter },
      props: {
        docketEntryId: mockDocketEntryId,
        docketNumber: mockDocketNumber,
        isForIFrame: false,
        useSameTab: false,
      },
    });

    expect(
      await applicationContext.getUtilities().openUrlInNewTab,
    ).toHaveBeenCalledWith({ url: mockDocumentDownloadUrl });
  });

  it('should throw an error when getDocumentDownloadUrlInteractor fails', async () => {
    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockRejectedValueOnce(new Error());

    await expect(
      runAction(openCaseDocumentDownloadUrlAction, {
        modules: { presenter },
        props: {
          docketEntryId: mockDocketEntryId,
          docketNumber: mockDocketNumber,
          isForIFrame: false,
          useSameTab: false,
        },
      }),
    ).rejects.toThrow();
  });
});
