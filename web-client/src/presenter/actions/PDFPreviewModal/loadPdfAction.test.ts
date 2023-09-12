import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { loadPdfAction } from './loadPdfAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { testPdfDoc } from '../../../../../shared/src/business/test/getFakeFile';

describe('loadPdfAction', () => {
  global.Blob = function () {};

  const fakeFile = testPdfDoc;
  const b64File = `data:application/pdf;base64,${Buffer.from(
    String.fromCharCode.apply(null, fakeFile),
  ).toString('base64')}`;

  const mocks = {
    readAsArrayBufferMock: jest.fn().mockImplementation(async function () {
      this.result = fakeFile;
      await this.onload();
    }),
    readAsDataURLMock: jest.fn().mockImplementation(async function () {
      this.result = b64File;
      await this.onload();
    }),
  };

  /**
   * Mock FileReader Implementation
   */
  function MockFileReader() {
    this.onload = null;
    this.onerror = null;
    this.readAsDataURL = mocks.readAsDataURLMock;
    this.readAsArrayBuffer = mocks.readAsArrayBufferMock;
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
      createObjectURL: jest.fn(),
    };
  });

  it('should detect binary (not base64-encoded) pdf data and read it successfully', async () => {
    const result = await runAction(loadPdfAction, {
      modules: {
        presenter,
      },
      props: {
        file: fakeFile,
      },
      state: {
        pdfPreviewModal: {},
      },
    });

    expect(mocks.readAsArrayBufferMock).toHaveBeenCalled();
    expect(result.state.modal.pdfPreviewModal.error).toBeUndefined();
  });

  it('should detect base64-encoded pdf data and read it successfully', async () => {
    const result = await runAction(loadPdfAction, {
      modules: {
        presenter,
      },
      props: {
        file: b64File,
      },
      state: {
        pdfPreviewModal: {},
      },
    });

    expect(mocks.readAsDataURLMock).toHaveBeenCalled();
    expect(result.state.modal.pdfPreviewModal.error).toBeUndefined();
  });

  it('should return an error when given an invalid pdf', async () => {
    presenter.providers.router.createObjectURL.mockImplementationOnce(() => {
      throw new Error('bad pdf data');
    });
    await expect(
      runAction(loadPdfAction, {
        modules: {
          presenter,
        },
        props: {
          file: 'data:binary/pdf,INVALID-BYTES',
        },
        state: { pdfPreviewModal: {} },
      }),
    ).rejects.toThrow('bad pdf data');
  });

  it('should error out when the FileReader fails', async () => {
    mocks.readAsArrayBufferMock.mockImplementationOnce(function () {
      this.result = 'abc';
      this.onerror(new Error('An error called via reader.onerror.'));
    });

    await expect(
      runAction(loadPdfAction, {
        modules: {
          presenter,
        },
        props: {
          file: 'this my file',
        },
        state: {
          pdfPreviewModal: {},
        },
      }),
    ).rejects.toThrow('An error called via reader.onerror.');
  });

  it('sets the pdfPreviewUrl on state from the given file', async () => {
    presenter.providers.router.createObjectURL.mockReturnValue('fakePdfUri');

    const result = await runAction(loadPdfAction, {
      modules: {
        presenter,
      },
      props: {
        file: b64File,
      },
      state: {
        modal: { pdfPreviewModal: { error: 'Some Error' } },
      },
    });

    expect(result.state.modal.pdfPreviewModal.error).toBeUndefined();
    expect(result.state.pdfPreviewUrl).toEqual('fakePdfUri');
  });
});
