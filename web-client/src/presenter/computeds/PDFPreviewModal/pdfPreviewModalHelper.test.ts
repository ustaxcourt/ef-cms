import { pdfPreviewModalHelper } from './pdfPreviewModalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('pdfPreviewModalHelper', () => {
  it('should disable left and right buttons', () => {
    const result = runCompute(pdfPreviewModalHelper, {
      state: {
        modal: {
          pdfPreviewModal: {
            currentPage: 1,
            totalPages: 1,
          },
        },
      },
    });

    expect(result.disableLeftButtons).toBeTruthy();
    expect(result.disableRightButtons).toBeTruthy();
    expect(result.displayErrorText).toBeFalsy();
  });

  it('should disable left buttons only (first page)', () => {
    const result = runCompute(pdfPreviewModalHelper, {
      state: {
        modal: {
          pdfPreviewModal: {
            currentPage: 1,
            totalPages: 2,
          },
        },
      },
    });

    expect(result.disableLeftButtons).toBeTruthy();
    expect(result.disableRightButtons).toBeFalsy();
    expect(result.displayErrorText).toBeFalsy();
  });

  it('should disable right buttons only (last page)', () => {
    const result = runCompute(pdfPreviewModalHelper, {
      state: {
        modal: {
          pdfPreviewModal: {
            currentPage: 2,
            totalPages: 2,
          },
        },
      },
    });

    expect(result.disableLeftButtons).toBeFalsy();
    expect(result.disableRightButtons).toBeTruthy();
    expect(result.displayErrorText).toBeFalsy();
  });

  it('should enable both buttons (middle page)', () => {
    const result = runCompute(pdfPreviewModalHelper, {
      state: {
        modal: {
          pdfPreviewModal: {
            currentPage: 2,
            totalPages: 3,
          },
        },
      },
    });

    expect(result.disableLeftButtons).toBeFalsy();
    expect(result.disableRightButtons).toBeFalsy();
    expect(result.displayErrorText).toBeFalsy();
  });

  it('should display error text if there is an error', () => {
    const result = runCompute(pdfPreviewModalHelper, {
      state: {
        modal: {
          pdfPreviewModal: {
            error: true,
          },
        },
      },
    });

    expect(result.displayErrorText).toBeTruthy();
  });
});
