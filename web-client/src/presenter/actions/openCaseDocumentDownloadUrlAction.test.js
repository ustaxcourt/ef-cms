import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { openCaseDocumentDownloadUrlAction } from './openCaseDocumentDownloadUrlAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('openCaseDocumentDownloadUrlAction', () => {
  const openInNewTab = jest.fn();

  beforeAll(() => {
    window.open = jest.fn().mockReturnValue({
      location: { href: '' },
    });
    delete window.location;
    window.location = { href: '' };

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = { openInNewTab };

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

  it('should open in a new tab when props.useSameTab and props.isForIFrame is false', async () => {
    await runAction(openCaseDocumentDownloadUrlAction, {
      modules: { presenter },
      props: {
        docketEntryId: 'docket-entry-id-123',
        docketNumber: '123-20',
        useSameTab: false,
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentDownloadUrlInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: '123-20',
      key: 'docket-entry-id-123',
    });
    expect(openInNewTab).toHaveBeenCalledWith('http://example.com');
  });
});
