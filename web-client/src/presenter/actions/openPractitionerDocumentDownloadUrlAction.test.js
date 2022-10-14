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

  it('should should open a new tab with the downloaded file', async () => {
    await runAction(openPractitionerDocumentDownloadUrlAction, {
      modules: { presenter },
      props: {
        fileName: 'file.png',
        practitionerDocumentFileId: 'mockFileId1234',
      },
    });

    expect(window.open().location.href).toEqual('http://example.com');
  });

  it('should close the window after download if a word doc is being downloaded', async () => {
    await runAction(openPractitionerDocumentDownloadUrlAction, {
      modules: { presenter },
      props: {
        fileName: 'file.docx',
        practitionerDocumentFileId: 'mockFileId1234',
      },
    });
    expect(window.close()).toHaveBeenCalled();
  });

  // it('should throw an error when document file ID is left blank', async () => {
  //   expect(
  //     await runAction(openPractitionerDocumentDownloadUrlAction, {
  //       props: {
  //         fileName: 'file.pdf',
  //         practitionerDocumentFileId: undefined,
  //       },
  //     }),
  //   ).rejects.toThrow();
  // });
});
