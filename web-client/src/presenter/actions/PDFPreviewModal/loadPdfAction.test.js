import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { loadPdfAction } from './loadPdfAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

const mocks = {
  readAsArrayBufferMock: jest.fn(function () {
    this.result = 'def';
    this.onload();
  }),
  readAsDataURLMock: jest.fn(function () {
    this.result = 'abc';
    this.onload();
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
        file: { fakeType: 'Blob' },
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
        file: 'data:binary/pdf,valid-pdf-encoded-with-base64==',
      },
      state: {
        pdfPreviewModal: {},
      },
    });

    expect(mocks.readAsDataURLMock).toHaveBeenCalled();
    expect(presenter.providers.path.success).toHaveBeenCalled();
  });

  it('should return an error when given an invalid pdf', async () => {
    applicationContext.getPdfJs().getDocument = jest
      .fn()
      .mockImplementationOnce(() => ({
        promise: Promise.reject(new Error('bad pdf data')),
      }));
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
    mocks.readAsDataURLMock.mockImplementationOnce(function () {
      this.result = 'abc';
      this.onerror('An error called via reader.onerror.');
    });

    const result = await runAction(loadPdfAction, {
      modules: {
        presenter,
      },
      props: {
        ctx: 'abc',
        file: 'data:binary/pdf,valid-pdf-encoded-with-base64==',
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
