import {
  applicationContextForClient as applicationContext,
  testPdfDoc,
} from '../../../../../shared/src/business/test/createTestApplicationContext';
import { loadPdfAction } from './loadPdfAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

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

describe('loadPdfAction', () => {
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
    applicationContext.getPdfLib.mockResolvedValue({
      PDFDocument: {
        load: jest.fn().mockRejectedValueOnce('bad pdf data'),
      },
    });

    const result = await runAction(loadPdfAction, {
      modules: {
        presenter,
      },
      props: {
        file: 'data:binary/pdf,INVALID-BYTES',
      },
      state: {
        pdfPreviewModal: {},
      },
    });

    expect(result.state.modal.pdfPreviewModal.error).toEqual('bad pdf data');
  });

  it('should error out when the FileReader fails', async () => {
    mocks.readAsArrayBufferMock.mockImplementationOnce(function () {
      this.result = 'abc';
      this.onerror('An error called via reader.onerror.');
    });

    const result = await runAction(loadPdfAction, {
      modules: {
        presenter,
      },
      props: {
        file: 'this my file',
      },
      state: {
        pdfPreviewModal: {},
      },
    });

    expect(result.state.modal.pdfPreviewModal).toMatchObject({
      error: 'An error called via reader.onerror.',
    });
  });

  it('sets the pdfPreviewUrl on state from the given file', async () => {
    const saveAsBase64Mock = jest.fn().mockResolvedValue('fakePdfUri');

    applicationContext.getPdfLib.mockResolvedValue({
      PDFDocument: {
        load: jest.fn().mockReturnValue({
          saveAsBase64: saveAsBase64Mock,
        }),
      },
    });
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

    expect(result.state.pdfPreviewUrl).toEqual('fakePdfUri');
  });
});
