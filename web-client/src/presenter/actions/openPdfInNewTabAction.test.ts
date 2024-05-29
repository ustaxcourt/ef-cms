import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { openPdfInNewTabAction } from './openPdfInNewTabAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { testPdfDoc } from '../../../../shared/src/business/test/getFakeFile';

describe('openPdfInNewTabAction', () => {
  const fakeFile = testPdfDoc;
  const fakeUrl = new URL('http://www.fakeurl.com/test').toString();

  const mockReadArrayBuffer = jest.fn().mockImplementation(async function () {
    this.result = fakeFile;
    await this.onload();
  });

  function MockFileReader() {
    this.onload = null;
    this.onerror = null;
    this.readAsArrayBuffer = mockReadArrayBuffer;
  }

  applicationContext.getFileReaderInstance.mockReturnValue(
    new MockFileReader(),
  );

  presenter.providers.applicationContext = applicationContext;
  presenter.providers.router = {
    createObjectURL: jest.fn().mockImplementation(() => {
      return fakeUrl;
    }),
  };

  it('opens a valid PDF in a new tab', async () => {
    await runAction(openPdfInNewTabAction, {
      modules: {
        presenter,
      },
      props: {
        file: fakeFile,
      },
    });

    expect(mockReadArrayBuffer).toHaveBeenCalled();
    expect(
      applicationContext.getUtilities().openUrlInNewTab,
    ).toHaveBeenCalledWith({ url: fakeUrl });
  });
});
