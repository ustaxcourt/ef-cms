import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { openPdfInNewTabAction } from './openPdfInNewTabAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { testPdfDoc } from '../../../../shared/src/business/test/getFakeFile';

describe('openPdfInNewTabAction', () => {
  const fakeFile = testPdfDoc;
  const fakeUrl = new URL('http://www.fakeurl.com/test').toString();

  class MockFileReader {
    result: ArrayBuffer | string | null = null;
    onload: (this, ev: ProgressEvent<FileReader>) => any = jest.fn();

    constructor(result) {
      this.result = result;
    }

    readAsArrayBuffer(): void {
      const event = new ProgressEvent('load');
      this.onload(event as ProgressEvent<FileReader>);
    }
  }

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.router = {
    createObjectURL: jest.fn().mockImplementation(() => {
      return fakeUrl;
    }),
  };

  it('opens a valid PDF in a new tab', async () => {
    applicationContext.getFileReaderInstance.mockReturnValue(
      new MockFileReader(fakeFile),
    );

    await runAction(openPdfInNewTabAction, {
      modules: {
        presenter,
      },
      props: {
        file: fakeFile,
      },
    });

    expect(
      applicationContext.getUtilities().openUrlInNewTab,
    ).toHaveBeenCalledWith({ url: fakeUrl });
  });

  it('does not open a PDF if reader.result is null', async () => {
    applicationContext.getFileReaderInstance.mockReturnValue(
      new MockFileReader(null),
    );

    await runAction(openPdfInNewTabAction, {
      modules: {
        presenter,
      },
      props: {
        file: fakeFile,
      },
    });

    expect(
      applicationContext.getUtilities().openUrlInNewTab,
    ).not.toHaveBeenCalled();
  });
});
