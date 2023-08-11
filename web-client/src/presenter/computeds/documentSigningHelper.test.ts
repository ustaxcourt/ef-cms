import { documentSigningHelper } from './documentSigningHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('documentSigningHelper', () => {
  it('enables page navigation when signature is not applied', () => {
    const result = runCompute(documentSigningHelper, {
      state: {
        pdfForSigning: {
          pdfjsObj: {
            numPages: 1,
          },
        },
      },
    });

    expect(result.disablePrevious).toBeFalsy();
    expect(result.disableNext).toBeFalsy();
  });

  it('disables page navigation when signature is applied', () => {
    const result = runCompute(documentSigningHelper, {
      state: {
        pdfForSigning: {
          pdfjsObj: {
            numPages: 1,
          },
          signatureApplied: true,
          signatureData: {},
        },
      },
    });

    expect(result.disablePrevious).toBeTruthy();
    expect(result.disableNext).toBeTruthy();
  });

  // n = number of pages, p = current page
  it('returns correct pagination properties (n=4, p=3)', () => {
    const result = runCompute(documentSigningHelper, {
      state: {
        pdfForSigning: {
          pageNumber: 3,
          pdfjsObj: {
            numPages: 4,
          },
        },
      },
    });

    expect(result.disablePrevious).toBeFalsy();
    expect(result.disableNext).toBeFalsy();
    expect(result.nextPageNumber).toEqual(4);
    expect(result.previousPageNumber).toEqual(2);
  });

  it('returns correct pagination properties (n=4, p=4)', () => {
    const result = runCompute(documentSigningHelper, {
      state: {
        pdfForSigning: {
          pageNumber: 4,
          pdfjsObj: {
            numPages: 4,
          },
        },
      },
    });

    expect(result.disablePrevious).toBeFalsy();
    expect(result.disableNext).toBeTruthy();
    expect(result.nextPageNumber).toEqual(4);
    expect(result.previousPageNumber).toEqual(3);
  });

  it('returns correct pagination properties (n=4, p=1)', () => {
    const result = runCompute(documentSigningHelper, {
      state: {
        pdfForSigning: {
          pageNumber: 1,
          pdfjsObj: {
            numPages: 4,
          },
        },
      },
    });

    expect(result.disablePrevious).toBeTruthy();
    expect(result.disableNext).toBeFalsy();
    expect(result.nextPageNumber).toEqual(2);
    expect(result.previousPageNumber).toEqual(1);
  });
});
