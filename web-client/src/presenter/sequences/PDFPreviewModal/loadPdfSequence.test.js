import { CerebralTest } from 'cerebral/test';
import {
  applicationContextForClient as applicationContext,
  testPdfDoc,
} from '../../../../../shared/src/business/test/createTestApplicationContext';
import { loadPdfSequence } from '../../sequences/PDFPreviewModal/loadPdfSequence';
import { presenter } from '../../presenter-mock';

const base64File = `data:application/pdf;base64,${Buffer.from(
  String.fromCharCode.apply(null, testPdfDoc),
).toString('base64')}`;

const mocks = {
  readAsArrayBufferMock: jest.fn(function () {
    this.result = testPdfDoc;
    this.onload();
  }),
  readAsDataURLMock: jest.fn(function () {
    this.result = base64File;
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
      file: testPdfDoc,
    });
    expect(test.getState('modal.pdfPreviewModal')).toMatchObject({
      ctx: 'abc',
      pdfDoc: expect.anything(),
      totalPages: 1,
    });
  });
});
