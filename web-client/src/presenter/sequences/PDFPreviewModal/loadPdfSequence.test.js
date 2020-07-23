import { CerebralTest } from 'cerebral/test';
import {
  applicationContextForClient as applicationContext,
  getFakeFile,
} from '../../../../../shared/src/business/test/createTestApplicationContext';
import { loadPdfSequence } from '../../sequences/PDFPreviewModal/loadPdfSequence';
import { presenter } from '../../presenter-mock';

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

let test;

describe('loadPdfSequence', () => {
  beforeAll(() => {
    applicationContext.getFileReaderInstance.mockReturnValue(
      new MockFileReader(),
    );
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      loadPdfSequence,
    };
    test = CerebralTest(presenter);
  });
  it('should load the expected objects onto the store and try to render the page into the context', async () => {
    test.setState('pdfPreviewModal', {});
    await test.runSequence('loadPdfSequence', {
      ctx: 'abc',
      file: getFakeFile(),
    });
    expect(test.getState('modal.pdfPreviewModal')).toMatchObject({
      ctx: 'abc',
      currentPage: 1,
      height: 100,
      pdfDoc: { numPages: 5 },
      totalPages: 5,
      width: 100,
    });
  });
});
