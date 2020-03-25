import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { loadPdfAction } from './loadPdfAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

const mocks = {
  getDocumentMock: jest.fn(() => ({
    promise: Promise.resolve({
      getPage: async () => ({
        getViewport: () => ({
          height: 100,
          width: 100,
        }),
        render: () => null,
      }),
      numPages: 5,
    }),
  })),
  readAsArrayBufferMock: jest.fn(function () {
    this.result = 'def';
    this.onload();
  }),
  readAsDataURLMock: jest.fn(function () {
    this.result = 'abc';
    this.onload();
  }),
};

presenter.providers.applicationContext = applicationContext;

applicationContext.getFileReader.mockImplementation(
  () =>
    function () {
      this.onload = null;
      this.onerror = null;
      this.readAsDataURL = mocks.readAsDataURLMock;
      this.readAsArrayBuffer = mocks.readAsArrayBufferMock;
    },
);
applicationContext.getPdfJs.mockImplementation(() => ({
  getDocument: mocks.getDocumentMock,
}));

let pathError = jest.fn();
let pathSuccess = jest.fn();

presenter.providers.path = {
  error: pathError,
  success: pathSuccess,
};

describe('loadPdfAction', () => {
  beforeEach(() => {
    global.atob = x => x;
  });
  afterEach(() => {
    jest.clearAllMocks();
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
    expect(pathSuccess).toHaveBeenCalled();
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
    expect(pathSuccess).toHaveBeenCalled();
  });

  it('should return an error when given an invalid pdf', async () => {
    mocks.getDocumentMock = jest.fn(() => ({
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

    expect(pathError).toHaveBeenCalled();
  });

  it('should error out when the FileReader fails', async () => {
    mocks.readAsDataURLMock = jest.fn().mockImplementationOnce(function () {
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
    expect(pathError).toHaveBeenCalled();
  });
});
