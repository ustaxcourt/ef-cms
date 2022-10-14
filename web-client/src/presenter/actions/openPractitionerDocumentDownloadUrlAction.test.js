/** @jest-environment jsdom */
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import {
  openPractitionerDocumentDownloadUrlAction,
  openUrlInNewTab,
} from './openPractitionerDocumentDownloadUrlAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('openPractitionerDocumentDownloadUrlAction', () => {
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
      .getPractitionerDocumentDownloadUrlInteractor.mockResolvedValue({
        url: 'http://example.com',
      });
  });

  it('should open a new tab with the downloaded file', async () => {
    await runAction(openPractitionerDocumentDownloadUrlAction, {
      modules: { presenter },
      props: {
        fileName: 'file.png',
        practitionerDocumentFileId: 'mockFileId1234',
      },
    });

    expect(window.open().location.href).toEqual('http://example.com');
  });

  it('should close the new tab after a word document has been downloaded', async () => {
    global.setTimeout = cb => cb();
    await openUrlInNewTab('file.docx', () => {
      return { url: 'example.com' };
    });

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should throw an error if url is invalid', async () => {
    global.setTimeout = cb => cb();
    await expect(
      openUrlInNewTab('file.docx', () => {
        throw new Error();
      }),
    ).rejects.toThrow();

    expect(closeSpy).toHaveBeenCalled();
  });
});
