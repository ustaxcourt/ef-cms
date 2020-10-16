import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { openCaseDocumentDownloadUrlAction } from './openCaseDocumentDownloadUrlAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('openCaseDocumentDownloadUrlAction', () => {
  beforeAll(() => {
    window.open = jest.fn().mockReturnValue({
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

  it('sets iframeSrc with the url', async () => {
    const result = await runAction(openCaseDocumentDownloadUrlAction, {
      modules: { presenter },
      props: {
        docketEntryId: 'docket-entry-id-123',
        docketNumber: '123-20',
        isForIFrame: true,
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentDownloadUrlInteractor,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        docketNumber: '123-20',
        key: 'docket-entry-id-123',
      }),
    );
    expect(result.state).toMatchObject({
      iframeSrc: 'http://example.com',
    });
  });

  it('calls window.open with a blank tab for non-mobile', async () => {
    await runAction(openCaseDocumentDownloadUrlAction, {
      modules: { presenter },
      props: {
        docketEntryId: 'docket-entry-id-123',
        docketNumber: '123-20',
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentDownloadUrlInteractor,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        docketNumber: '123-20',
        key: 'docket-entry-id-123',
      }),
    );
    expect(window.open).toHaveBeenCalledWith('http://example.com', '_blank');
  });

  it('calls window.open (opens new tab on mobile) and sets window.location.href for mobile', async () => {
    await runAction(openCaseDocumentDownloadUrlAction, {
      modules: { presenter },
      props: {
        docketEntryId: 'docket-entry-id-123',
        docketNumber: '123-20',
        isMobile: true,
      },
    });

    expect(
      applicationContext.getUseCases().getDocumentDownloadUrlInteractor,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        docketNumber: '123-20',
        key: 'docket-entry-id-123',
      }),
    );
    expect(window.location.href).toEqual('http://example.com');
  });
});
