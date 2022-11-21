import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import {
  openPractitionerDocumentDownloadUrlAction,
  openUrlInNewTab,
} from './openPractitionerDocumentDownloadUrlAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('openPractitionerDocumentDownloadUrlAction', () => {
  const writeSpy = jest.fn();

  beforeEach(() => {
    window.open = jest.fn().mockReturnValue({
      document: {
        write: writeSpy,
      },
      location: { href: '' },
    });

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
});

describe('openUrlInNewTab', () => {
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
  });

  it('should open a new tab before fetching the url to open', async () => {
    try {
      await openUrlInNewTab(() => {
        throw new Error();
      });
    } catch (e) {
      expect(window.open).toHaveBeenCalled();
    }
  });

  it('should throw an error if url is invalid', async () => {
    await expect(
      openUrlInNewTab(() => {
        throw new Error();
      }),
    ).rejects.toThrow();
  });
});
