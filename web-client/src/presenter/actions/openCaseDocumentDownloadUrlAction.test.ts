import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { openCaseDocumentDownloadUrlAction } from './openCaseDocumentDownloadUrlAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('openCaseDocumentDownloadUrlAction', () => {
  const mockDocketNumber = '123-20';
  const mockDocketEntryId = 'df5d81cc-d67b-418d-9626-8ad92c939d83';
  const mockDocumentDownloadUrl = 'http://example.com/abc.pdf';

  presenter.providers.applicationContext = applicationContext;

  let hrefSetter: jest.SpyInstance | undefined;
  let assignSpy: jest.SpyInstance | undefined;

  beforeEach(() => {
    window.history.replaceState({}, '', '/');

    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockResolvedValue({
        url: mockDocumentDownloadUrl,
      });

    const implSymbol = Reflect.ownKeys(window.location).find(
      k => typeof k === 'symbol',
    )!;

    hrefSetter = jest
      .spyOn(
        Object.getPrototypeOf((window.location as any)[implSymbol]),
        'href',
        'set',
      )
      .mockImplementation(() => {});
  });

  afterEach(() => {
    hrefSetter?.mockRestore();
    assignSpy?.mockRestore();
    jest.clearAllMocks();
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
        useSameTab: true,
      },
    });

    expect(hrefSetter).toHaveBeenCalledWith(mockDocumentDownloadUrl);
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
      applicationContext.getUtilities().openUrlInNewTab,
    ).toHaveBeenCalledWith({ url: mockDocumentDownloadUrl });
    expect(hrefSetter).not.toHaveBeenCalled();
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
