import {
  applicationContextForClient as applicationContext,
  testPdfDoc,
} from '../../../../../shared/src/business/test/createTestApplicationContext';
import { loadPdfAction } from './loadPdfAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

const fakeFile = testPdfDoc;
const b64File = `data:application/pdf;base64,${btoa(
  String.fromCharCode.apply(null, fakeFile),
)}`;

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
    await runAction(loadPdfAction, {
      modules: {
        presenter,
      },
      props: {
        ctx: 'abc',
        file: fakeFile,
      },
      state: {
        pdfPreviewModal: {},
      },
    });

    expect(mocks.readAsArrayBufferMock).toHaveBeenCalled();
    expect(presenter.providers.path.success).toHaveBeenCalled();
  });

  it('should detect base64-encoded pdf data and read it successfully', async () => {
    await runAction(loadPdfAction, {
      modules: {
        presenter,
      },
      props: {
        ctx: 'abc',
        file: b64File,
      },
      state: {
        pdfPreviewModal: {},
      },
    });

    expect(mocks.readAsDataURLMock).toHaveBeenCalled();
    expect(presenter.providers.path.success).toHaveBeenCalled();
  });

  it('should return an error when given an invalid pdf', async () => {
    applicationContext.getPdfLib.mockReturnValue({
      PDFDocument: {
        load: Promise.reject(new Error('bad pdf data')),
      },
    });

    await runAction(loadPdfAction, {
      modules: {
        presenter,
      },
      props: {
        ctx: 'abc',
        file: 'data:binary/pdf,INVALID-BYTES',
      },
      state: {
        pdfPreviewModal: {},
      },
    });

    expect(presenter.providers.path.error).toHaveBeenCalled();
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
        ctx: 'abc',
        file: 'this my file',
      },
      state: {
        pdfPreviewModal: {},
      },
    });

    expect(result.state.modal.pdfPreviewModal).toMatchObject({
      ctx: 'abc',
      error: 'An error called via reader.onerror.',
    });
    expect(presenter.providers.path.error).toHaveBeenCalled();
  });
});
