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
        barNumber: 'PT1234',
        fileName: 'file.png',
        practitionerDocumentFileId: 'mockFileId1234',
      },
    });

    expect(window.open().location.href).toEqual('http://example.com');
  });

  it('should throw an error if url is invalid', async () => {
    await expect(
      openUrlInNewTab(() => {
        throw new Error();
      }),
    ).rejects.toThrow();
  });
});
