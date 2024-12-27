import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { loadPdfForTabAction } from '../PDFPreviewTab/loadPdfForTabAction';
import { openUrlInNewTab } from '@web-client/presenter/utilities/openUrlInNewTab';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { testPdfDoc } from '../../../../../shared/src/business/test/getFakeFile';

jest.mock('@web-client/presenter/utilities/openUrlInNewTab');

describe('loadPdfForTabAction', () => {
  let originalWindowOpen;

  const fakeFile = testPdfDoc;
  const b64File = `data:application/pdf;base64,${Buffer.from(
    String.fromCharCode(...fakeFile),
  ).toString('base64')}`;

  const mocks = {
    readAsArrayBufferMock: jest.fn().mockImplementation(async function (this: {
      result: any;
      onload: any;
    }) {
      this.result = fakeFile;
      await this.onload();
    }),
    readAsDataURLMock: jest.fn().mockImplementation(async function (this: {
      result: any;
      onload: any;
    }) {
      this.result = b64File;
      await this.onload();
    }),
  };

  class MockFileReader {
    public result: unknown = null;
    public onload: any;
    public onerror: any;

    readAsDataURL = mocks.readAsDataURLMock;
    readAsArrayBuffer = mocks.readAsArrayBufferMock;
  }

  beforeAll(() => {
    global.atob = x => x;
    presenter.providers.path = {
      error: jest.fn(),
      success: jest.fn(),
    };
    applicationContext.getFileReaderInstance.mockReturnValue(
      new MockFileReader(),
    );
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      createObjectURL: jest.fn().mockReturnValue('some url'),
    };
    originalWindowOpen = window.open;
    (openUrlInNewTab as jest.Mock).mockImplementation(jest.fn());
    window.open = jest.fn();
  });

  afterAll(() => {
    window.open = originalWindowOpen;
    jest.restoreAllMocks();
  });

  it('should call window.open with correcturl for pdf file', async () => {
    await runAction(loadPdfForTabAction, {
      modules: {
        presenter,
      },
      props: { file: fakeFile },
    });

    expect(openUrlInNewTab).toHaveBeenCalledWith({ url: 'some url' });
  });

  it('should detect binary (not base64-encoded) pdf data and read it successfully', async () => {
    await runAction(loadPdfForTabAction, {
      modules: {
        presenter,
      },
      props: {
        file: fakeFile,
      },
    });

    expect(mocks.readAsArrayBufferMock).toHaveBeenCalled();
  });

  it('should return an error when given an invalid pdf', async () => {
    presenter.providers.router.createObjectURL.mockImplementationOnce(() => {
      throw new Error('bad pdf data');
    });
    await expect(
      runAction(loadPdfForTabAction, {
        modules: {
          presenter,
        },
        props: {
          file: 'data:binary/pdf,INVALID-BYTES',
        },
      }),
    ).rejects.toThrow('bad pdf data');
  });

  it('should error out when the FileReader fails', async () => {
    mocks.readAsArrayBufferMock.mockImplementationOnce(function (this: {
      result: any;
      onerror: any;
    }) {
      this.result = 'abc';
      this.onerror(new Error('An error called via reader.onerror.'));
    });

    await expect(
      runAction(loadPdfForTabAction, {
        modules: {
          presenter,
        },
        props: {
          file: 'this my file',
        },
      }),
    ).rejects.toThrow('An error called via reader.onerror.');
  });
});
