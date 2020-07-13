import { CerebralTest } from 'cerebral/test';
import {
  applicationContextForClient as applicationContext,
  getFakeFile,
} from '../../../../../shared/src/business/test/createTestApplicationContext';
import { loadPdfSequence } from '../../sequences/PDFPreviewModal/loadPdfSequence';
import { presenter } from '../../presenter-mock';
import { setPageSequence } from '../../sequences/PDFPreviewModal/setPageSequence';

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

describe('setPageSequence', () => {
  beforeAll(() => {
    applicationContext.getFileReaderInstance.mockReturnValue(
      new MockFileReader(),
    );
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      loadPdfSequence,
      setPageSequence,
    };
    test = CerebralTest(presenter);
  });
  beforeEach(async () => {
    test.setState('modal.pdfPreviewModal', {});
    await test.runSequence('loadPdfSequence', {
      ctx: 'abc',
      file: getFakeFile(),
    });
  });

  it('should not allow the desired page to go above the totalPages', async () => {
    await test.runSequence('setPageSequence', {
      currentPage: 100,
    });
    expect(test.getState('modal.pdfPreviewModal')).toMatchObject({
      currentPage: 5,
    });
  });

  it('should not allow the desired page to go below 1', async () => {
    await test.runSequence('setPageSequence', {
      currentPage: -200,
    });
    expect(test.getState('modal.pdfPreviewModal')).toMatchObject({
      currentPage: 1,
    });
  });

  it('should set the desired page if inside the range', async () => {
    await test.runSequence('setPageSequence', {
      currentPage: 3,
    });
    expect(test.getState('modal.pdfPreviewModal')).toMatchObject({
      currentPage: 3,
    });
  });
});
