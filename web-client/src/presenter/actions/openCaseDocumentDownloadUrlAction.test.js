import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { openCaseDocumentDownloadUrlAction } from './openCaseDocumentDownloadUrlAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('openCaseDocumentDownloadUrlAction', () => {
  const closeSpy = jest.fn();
  const writeSpy = jest.fn();

  beforeEach(() => {
    window.open = jest.fn().mockReturnValue({
      close: closeSpy,
      document: {
        write: writeSpy,
      },
      location: { href: '' },
    });
    delete window.location;
    window.location = { href: '' };

    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockResolvedValue({
        url: 'http://example.com',
      });
  });

  it('should set iframeSrc with the url when props.isForIFrame is true', async () => {
    const result = await runAction(openCaseDocumentDownloadUrlAction, {
      modules: { presenter },
      props: {
        docketEntryId: 'docket-entry-id-123',
        docketNumber: '123-20',
        isForIFrame: true,
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentDownloadUrlInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: '123-20',
      key: 'docket-entry-id-123',
    });
    expect(result.state).toMatchObject({
      iframeSrc: 'http://example.com',
    });
  });

  it('should set window.location.href when props.useSameTab is true and props.isForIFrame is false', async () => {
    await runAction(openCaseDocumentDownloadUrlAction, {
      modules: { presenter },
      props: {
        docketEntryId: 'docket-entry-id-123',
        docketNumber: '123-20',
        useSameTab: true,
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentDownloadUrlInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: '123-20',
      key: 'docket-entry-id-123',
    });
    expect(window.location.href).toEqual('http://example.com');
  });

  it('should open in a new tab when props.useSameTab and props.isForIFrame are false', async () => {
    await runAction(openCaseDocumentDownloadUrlAction, {
      modules: { presenter },
      props: {
        docketEntryId: 'docket-entry-id-123',
        docketNumber: '123-20',
        isForIFrame: false,
        useSameTab: false,
      },
    });

    expect(window.open).toHaveBeenCalled();
    expect(writeSpy).toHaveBeenCalled();

    expect(
      applicationContext.getUseCases().getDocumentDownloadUrlInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: '123-20',
      key: 'docket-entry-id-123',
    });
    expect(window.open().location.href).toEqual('http://example.com');
  });

  it('should throw an error when getDocumentDownloadUrlInteractor fails', async () => {
    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockRejectedValue(new Error());

    await expect(
      runAction(openCaseDocumentDownloadUrlAction, {
        modules: { presenter },
        props: {
          docketEntryId: 'docket-entry-id-123',
          docketNumber: '123-20',
          isForIFrame: false,
          useSameTab: false,
        },
      }),
    ).rejects.toThrow();

    expect(closeSpy).toHaveBeenCalled();
    expect(window.open().close).toHaveBeenCalled();
  });

  it('should not try to close openedPdfWindow if it does not exist when getDocumentDownloadUrlInteractor fails', async () => {
    window.open = jest.fn().mockReturnValue(null);

    applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor.mockRejectedValue(new Error());

    await expect(
      runAction(openCaseDocumentDownloadUrlAction, {
        modules: { presenter },
        props: {
          docketEntryId: 'docket-entry-id-123',
          docketNumber: '123-20',
          isForIFrame: false,
          useSameTab: false,
        },
      }),
    ).rejects.toThrow();

    expect(closeSpy).not.toHaveBeenCalled();
  });
});
